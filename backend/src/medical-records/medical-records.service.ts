import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from '../products/products.service';
import { FinanceService } from '../finance/finance.service';
import { AppointmentsService } from '../appointments/appointments.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MedicalRecordCreatedEvent } from '../events/listeners/medical-record.listener';

@Injectable()
export class MedicalRecordsService {
    constructor(
        private prisma: PrismaService,
        private productsService: ProductsService,
        private financeService: FinanceService,
        private appointmentsService: AppointmentsService,
        private eventEmitter: EventEmitter2
    ) { }

    async create(data: any) {
        // 1. Create Medical Record
        const record = await this.prisma.medicalRecord.create({
            data: {
                appointmentId: data.appointmentId,
                petId: data.petId,
                vetId: data.vetId,
                anamnesis: data.anamnesis,
                physicalExam: data.physicalExam,
                temperature: data.temperature ? parseFloat(data.temperature) : null,
                mucosa: data.mucosa,
                painLevel: data.painLevel,
                diagnosis: data.diagnosis,
                treatment: data.treatment,
                consumedItems: data.consumedItems ? JSON.stringify(data.consumedItems) : null
            }
        });

        // 2. Process Consumed Items (Stock & Finance)
        let extraCosts = 0;
        const descriptionItems: string[] = [];

        if (data.consumedItems && data.consumedItems.length > 0) {
            for (const item of data.consumedItems) {
                // Deduct Stock
                if (item.productId) {
                    try {
                        await this.productsService.updateStock(item.productId, item.quantity ? -item.quantity : -1);
                    } catch (e) {
                        console.warn(`Failed to update stock for ${item.productId}`, e);
                    }
                }

                // Accumulate Cost
                const qty = item.quantity || 1;
                const price = Number(item.price) || 0;
                extraCosts += (price * qty);
                descriptionItems.push(`${item.name} (x${qty})`);
            }
        }

        // 3. Generate Pending Charge (Service Name + Extras)
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: data.appointmentId },
            include: { service: true, tutor: true, pet: true }
        });

        if (appointment) {
            const servicePrice = appointment.service?.price ? Number(appointment.service.price) : 0;
            const totalAmount = servicePrice + extraCosts;
            const desc = `Atendimento ${appointment.pet.name} (${appointment.service?.name || 'Consulta'})` + (descriptionItems.length > 0 ? ` + Itens: ${descriptionItems.join(', ')}` : '');

            // Check if transaction already exists? For V1 assume one per appointment
            await this.prisma.financialTransaction.create({
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

            // 4. Emit Event for Sidebar Effects (Vaccines, Analytics, etc)
            this.eventEmitter.emit(
                'medical-record.created',
                new MedicalRecordCreatedEvent(
                    record.id,
                    data.consumedItems || [],
                    data.petId,
                    data.vetId,
                    appointment.clinicId
                )
            );
        }

        return record;
    }

    async findByAppointment(appointmentId: string) {
        return this.prisma.medicalRecord.findUnique({
            where: { appointmentId },
            include: {
                pet: true,
                vet: true,
                exams: true // Include Exams
            }
        });
    }

    async update(id: string, data: any) {
        // Check if locked
        const record = await this.prisma.medicalRecord.findUnique({ where: { id } });
        if (!record) throw new Error('Record not found');

        if (record.locked) {
            throw new Error('Medical Record is LOCKED. Cannot be edited. Use amendments.');
        }

        return this.prisma.medicalRecord.update({
            where: { id },
            data
        });
    }

    async addAmendment(recordId: string, authorId: string, content: string, reason?: string) {
        return this.prisma.recordAmendment.create({
            data: {
                medicalRecordId: recordId,
                authorId,
                content,
                reason
            }
        });
    }

    async lockRecord(id: string) {
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
