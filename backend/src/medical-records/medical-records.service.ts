import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from '../products/products.service';
import { FinanceService } from '../finance/finance.service';
import { AppointmentsService } from '../appointments/appointments.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MedicalRecordCreatedEvent } from '../events/listeners/medical-record.listener';

import { StockService } from '../stock/stock.service';

@Injectable()
export class MedicalRecordsService {
    constructor(
        private prisma: PrismaService,
        private productsService: ProductsService,
        private financeService: FinanceService,
        private appointmentsService: AppointmentsService,
        private eventEmitter: EventEmitter2,
        private stockService: StockService // Injected
    ) { }

    async create(data: any) {
        // Start Transaction Atom
        return this.prisma.$transaction(async (tx) => {
            // 0. Parse Structured Physical Exam
            let physicalExamData: any = {};
            try {
                if (typeof data.physicalExam === 'string') {
                    physicalExamData = JSON.parse(data.physicalExam);
                } else if (typeof data.physicalExam === 'object') {
                    physicalExamData = data.physicalExam || {};
                }
            } catch (e) { console.warn('Failed to parse physical exam JSON', e); }

            // 1. Consolidate Consumed Items (Manual + Internal Prescriptions + Procedures)
            const consumedItems = data.consumedItems || [];

            // Handle Prescriptions (Stock)
            if (data.prescriptions && Array.isArray(data.prescriptions)) {
                for (const rx of data.prescriptions) {
                    if (rx.type === 'INTERNAL' && rx.productId) {
                        consumedItems.push({
                            productId: rx.productId,
                            name: rx.drugName,
                            quantity: 1,
                            price: 0
                        });
                    }
                }
            }

            // Handle Procedures (Services)
            if (data.procedures && Array.isArray(data.procedures)) {
                for (const proc of data.procedures) {
                    consumedItems.push({
                        productId: null, // Service, not stock
                        name: proc.name,
                        quantity: 1,
                        price: proc.price || 0
                    });
                }
            }

            // 2. Create Medical Record with Relations
            const record = await tx.medicalRecord.create({
                data: {
                    appointmentId: data.appointmentId,
                    petId: data.petId,
                    vetId: data.vetId,

                    // Anamnesis & History
                    mainComplaint: data.mainComplaint,
                    anamnesis: data.history, // Mapping history to anamnesis field

                    // Structured Physical Exam
                    physicalExam: physicalExamData.notes || data.physicalExamNotes, // General notes
                    mucosa: physicalExamData.mucosa || data.mucosa,
                    tpc: physicalExamData.tpc || data.tpc,
                    hydration: physicalExamData.hydration || data.hydration,
                    abdominalPalpation: physicalExamData.abdominal || data.abdominalPalpation,
                    lymphNodes: physicalExamData.nodes || data.lymphNodes,
                    temperature: data.temperature ? parseFloat(data.temperature) : undefined,
                    weight: data.weight ? parseFloat(data.weight) : undefined,
                    pulse: data.pulse ? parseInt(data.pulse) : undefined,
                    respiratoryRate: data.respiratoryRate ? parseInt(data.respiratoryRate) : undefined,

                    // Diagnosis
                    differentialDiagnosis: data.differentialDiagnosis,
                    diagnosis: data.diagnosis,
                    prognosis: data.prognosis,

                    status: 'FINALIZED',

                    // Create Prescriptions
                    prescriptions: {
                        create: (data.prescriptions || []).map((rx: any) => ({
                            medicationName: rx.drugName,
                            dosage: rx.dosage,
                            frequency: rx.frequency,
                            duration: rx.duration,
                            route: rx.route,
                            details: rx.details || '',
                            prescribedById: data.vetId,
                            productId: rx.productId,
                            // type: rx.type // Not in schema, useful for logic only
                        }))
                    },

                    // Create Exam Requests
                    examRequests: {
                        create: (data.requestedExams && data.requestedExams.length > 0) ? [{
                            status: 'REQUESTED',
                            requestedExams: JSON.stringify(data.requestedExams),
                            priority: 'ROUTINE',
                            clinicalIndication: data.diagnosis
                        }] : []
                    },

                    consumedItems: JSON.stringify(consumedItems)
                }
            });

            // 3. Process Consumed Items (Stock & Finance)
            let extraCosts = 0;
            const descriptionItems: string[] = [];

            if (consumedItems.length > 0) {
                for (const item of consumedItems) {
                    // Deduct Stock via StockService (Passing TX)
                    if (item.productId) {
                        try {
                            await this.stockService.manualConsume({
                                clinicId: 'clinic-1', // Should get from context/appointment ideally
                                productId: item.productId,
                                quantity: Number(item.quantity || 1),
                                reason: `Consumo em Atendimento (Appt ${data.appointmentId})`,
                                userId: data.vetId
                            }, tx); // <--- Pass Transaction Client
                        } catch (e) {
                            console.warn(`Failed to update stock for ${item.productId}`, e);
                            throw new Error(`Estoque insuficiente ou erro no produto: ${item.name}`);
                        }
                    }

                    // Accumulate Cost
                    // If price not sent, we should probably fetch it? For now assume passed or 0.
                    // Future: fetch product price from DB if 0.
                    const qty = item.quantity || 1;
                    const price = Number(item.price) || 0;
                    extraCosts += (price * qty);
                    descriptionItems.push(`${item.name} (x${qty})`);
                }
            }

            let clinicId = 'unknown';

            // 4. Generate Pending Charge (Service Name + Extras)
            const appointment = await tx.appointment.findUnique({
                where: { id: data.appointmentId },
                include: { service: true, tutor: true, pet: true }
            });

            if (appointment) {
                clinicId = appointment.clinicId; // Capture for event
                const servicePrice = appointment.service?.price ? Number(appointment.service.price) : 0;
                const totalAmount = servicePrice + extraCosts;
                const desc = `Atendimento ${appointment.pet.name} (${appointment.service?.name || 'Consulta'})` + (descriptionItems.length > 0 ? ` + Itens: ${descriptionItems.join(', ')}` : '');

                await tx.financialTransaction.create({
                    data: {
                        type: 'INCOME',
                        amount: totalAmount,
                        description: desc,
                        status: 'PENDING', // Waiting for Reception Checkout
                        paymentMethod: 'PENDING',
                        category: 'Medical Services',
                        tutorId: appointment.tutorId,
                        clinicId: appointment.clinicId,
                        createdAt: new Date()
                    }
                });
            }

            return { record, clinicId };
        }).then(({ record, clinicId }) => {
            // Post-Transaction Side Effects
            this.eventEmitter.emit(
                'medical-record.created',
                new MedicalRecordCreatedEvent(
                    record.id,
                    data.consumedItems || [],
                    data.petId,
                    data.vetId,
                    clinicId
                )
            );
            return record;
        });
    }

    async findByAppointment(appointmentId: string, clinicId: string) {
        const record = await this.prisma.medicalRecord.findFirst({
            where: { appointmentId },
            include: {
                pet: true,
                vet: true,
                exams: true
            }
        });

        // Manual Clinic Check since Relation is nested
        if (record && record.pet && record.pet.clinicId !== clinicId) {
            throw new Error('Access denied');
        }

        return record;
    }

    async update(id: string, data: any, clinicId: string) {
        // Check if locked and belongs to clinic
        const record = await this.prisma.medicalRecord.findFirst({
            where: { id },
            include: { pet: true }
        });

        if (!record) throw new Error('Record not found');
        if (record.pet.clinicId !== clinicId) throw new Error('Access denied');

        if (record.locked) {
            throw new Error('Medical Record is LOCKED. Cannot be edited. Use amendments.');
        }

        return this.prisma.medicalRecord.update({
            where: { id },
            data
        });
    }

    async addAmendment(recordId: string, authorId: string, content: string, reason?: string) {
        // Check access? Typically guard handles it, but good to check emptiness
        return this.prisma.recordAmendment.create({
            data: {
                medicalRecordId: recordId,
                authorId,
                content,
                reason
            }
        });
    }

    async lockRecord(id: string, clinicId: string) {
        // Verify ownership first
        const record = await this.prisma.medicalRecord.findFirst({
            where: { id },
            include: { pet: true }
        });

        if (!record) throw new Error('Record not found');
        if (record.pet.clinicId !== clinicId) throw new Error('Access denied');

        return this.prisma.medicalRecord.update({
            where: { id },
            data: {
                locked: true,
                lockedAt: new Date()
            }
        });
    }

    async getAmendments(recordId: string) {
        return this.prisma.recordAmendment.findMany({
            where: { medicalRecordId: recordId },
            include: { author: { select: { fullName: true, role: true } } },
            orderBy: { createdAt: 'asc' }
        });
    }
}
