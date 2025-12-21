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
        // If boxId is provided, mark it as OCCUPIED
        if (data.boxId) {
            await this.prisma.box.update({
                where: { id: data.boxId },
                data: { status: 'OCCUPIED' }
            });
        }

        return this.prisma.internment.create({
            data: {
                petId: data.petId,
                clinicId: data.clinicId,
                reason: data.reason,
                bedNumber: data.bedNumber,
                boxId: data.boxId,
                status: 'ACTIVE',
                entryDate: new Date()
            }
        });
    }

    async createWard(data: any) {
        return this.prisma.ward.create({
            data: {
                name: data.name,
                type: data.type,
                description: data.description,
                clinicId: data.clinicId
            }
        });
    }

    async createBox(data: any) {
        return this.prisma.box.create({
            data: {
                name: data.name,
                wardId: data.wardId,
                status: 'AVAILABLE'
            }
        });
    }

    async getWards(clinicId: string) {
        return this.prisma.ward.findMany({
            where: { clinicId },
            include: {
                boxes: {
                    include: {
                        internments: {
                            where: { status: 'ACTIVE' },
                            include: {
                                pet: { include: { tutor: true } }
                            }
                        }
                    }
                }
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
        const internment = await this.prisma.internment.findUnique({ where: { id } });

        if (internment && internment.boxId) {
            await this.prisma.box.update({
                where: { id: internment.boxId },
                data: { status: 'CLEANING' } // Mark as cleaning after discharge
            });
        }

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

    async getActiveForTutor(userId: string) {
        const tutor = await this.prisma.tutor.findUnique({
            where: { userId }
        });

        if (!tutor) return [];

        return this.prisma.internment.findMany({
            where: {
                pet: { tutorId: tutor.id },
                status: 'ACTIVE'
            },
            include: {
                pet: true,
                dailyRecords: {
                    orderBy: { date: 'desc' },
                    take: 1
                },
                vitalSigns: {
                    orderBy: { dateTime: 'desc' },
                    take: 1
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
                customValues: data.customValues ? JSON.stringify(data.customValues) : null,
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
