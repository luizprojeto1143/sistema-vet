import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StockService } from '../stock/stock.service';

@Injectable()
export class InternmentService {
    constructor(
        private prisma: PrismaService,
        private stockService: StockService
    ) { }

    async admit(data: any) {
        return this.prisma.internment.create({
            data: {
                petId: data.petId,
                clinicId: data.clinicId,
                reason: data.reason,
                bedNumber: data.bedNumber,
                status: 'ACTIVE',
                entryDate: new Date()
            }
        });
    }

    async prescribe(data: any) {
        return this.prisma.prescription.create({
            data: {
                internmentId: data.internmentId,
                medicationName: data.medicationName,
                dosage: data.dosage,
                frequency: data.frequency,
                duration: data.duration,
                instructions: data.instructions,
                prescribedById: data.prescribedById,
                productId: data.productId
            }
        });
    }

    async discharge(id: string) {
        return this.prisma.internment.update({
            where: { id },
            data: {
                status: 'DISCHARGED',
                exitDate: new Date()
            }
        });
    }

    async getActive(clinicId: string) {
        return this.prisma.internment.findMany({
            where: { clinicId, status: 'ACTIVE' },
            include: {
                pet: { include: { tutor: true } },
                prescriptions: {
                    include: { executions: true }
                }
            }
        });
    }

    async getOne(id: string) {
        return this.prisma.internment.findUnique({
            where: { id },
            include: {
                pet: { include: { tutor: true } },
                prescriptions: {
                    include: { executions: true, prescribedBy: true }
                },
                dailyRecords: true,
                vitalSigns: { orderBy: { dateTime: 'asc' } }
            }
        });
    }

    async findOne(id: string) {
        return this.prisma.internment.findUnique({
            where: { id },
            include: {
                pet: { include: { tutor: true } },
                clinic: true,
                logs: {
                    orderBy: { date: 'desc' }, // Fixed: timestamp -> date
                    include: { author: true } // Fixed: user -> author
                }
            }
        });
    }

    async addLog(internmentId: string, data: any, authorId: string) {
        return this.prisma.internmentLog.create({
            data: {
                internmentId,
                description: data.notes || data.description, // Fixed: notes -> description
                type: 'CLINICAL',
                authorId: authorId
            }
        });
    }

    async executeMedication(data: any) {
        if (data.prescriptionId) {
            const prescription = await this.prisma.prescription.findUnique({
                where: { id: data.prescriptionId }
            });

            if (prescription && prescription.productId) {
                try {
                    await this.stockService.manualConsume({
                        clinicId: 'clinic-1', // TODO: Get from context
                        productId: prescription.productId,
                        quantity: 1,
                        userId: data.executedById,
                        reason: `Internação: Aplicação ${prescription.medicationName}`
                    });
                } catch (e) {
                    console.error("Stock deduction failed", e);
                }
            }
        }

        return this.prisma.medicationExecution.create({
            data: {
                prescriptionId: data.prescriptionId,
                executedById: data.executedById,
                notes: data.notes
            }
        });
    }

    async addDailyRecord(data: any) {
        return this.prisma.dailyRecord.create({
            data: {
                internmentId: data.internmentId,
                feed: data.feed,
                water: data.water,
                urine: data.urine,
                feces: data.feces,
                humor: data.humor,
                notes: data.notes,
                date: new Date()
            }
        });
    }

    async addVitalSign(data: any) {
        return this.prisma.vitalSign.create({
            data: {
                internmentId: data.internmentId,
                temperature: parseFloat(data.temperature),
                heartRate: parseInt(data.heartRate),
                respiratoryRate: parseInt(data.respiratoryRate),
                tpc: data.tpc,
                recordedById: data.recordedById
            }
        });
    }
}
