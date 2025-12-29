import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClinicalSummaryService {
    constructor(private prisma: PrismaService) { }

    async getPatientSummary(petId: string, clinicId: string) {
        // 1. Get Pet Basic Info & Chronic Conditions
        const pet = await this.prisma.pet.findUnique({
            where: { id: petId },
            select: {
                name: true,
                // age: true, // Calculated in frontend or service
                birthDate: true,
                weight: true,
                allergies: true,
                chronicConditions: true,
                tutor: {
                    select: { fullName: true, phone: true }
                }
            }
        });

        if (!pet) return null;

        // 2. Get Last 3 Medical Records
        const lastRecords = await this.prisma.medicalRecord.findMany({
            where: { petId, pet: { clinicId } },
            orderBy: { createdAt: 'desc' },
            take: 3,
            select: {
                createdAt: true,
                diagnosis: true,
                vet: { select: { fullName: true } }
            }
        });

        // 3. Get Active Prescriptions (Recent)
        const activePrescriptions = await this.prisma.prescription.findMany({
            where: {
                medicalRecord: {
                    petId,
                    createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
                }
            },
            select: {
                medicationName: true,
                dosage: true,
                frequency: true
            },
            take: 5
        });

        // 4. Check for Internment Status
        const activeInternment = await this.prisma.internment.findFirst({
            where: {
                petId,
                status: 'ACTIVE',
                clinicId
            }
        });

        // 5. Weight History (Last 10)
        const weightHistory = await this.prisma.medicalRecord.findMany({
            where: {
                petId,
                weight: { not: null }
            },
            orderBy: { createdAt: 'asc' }, // Ascending for chart
            take: 10,
            select: {
                createdAt: true,
                weight: true
            }
        });

        return {
            pet,
            lastRecords,
            activePrescriptions,
            weightHistory, // New Field
            isInterned: !!activeInternment,
            internmentLocation: activeInternment ? `Box ${activeInternment.boxId}` : null
        };
    }
}
