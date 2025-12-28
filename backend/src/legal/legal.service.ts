import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LegalService {
    constructor(private prisma: PrismaService) { }

    async createTemplate(clinicId: string, data: { title: string; content: string }) {
        return this.prisma.consentTemplate.create({
            data: { ...data, clinicId }
        });
    }

    async getTemplates(clinicId: string) {
        return this.prisma.consentTemplate.findMany({
            where: { clinicId, active: true }
        });
    }

    async signConsent(data: {
        tutorId: string;
        templateId: string;
        signatureUrl: string;
        ipAddress?: string;
        appointmentId?: string;
    }) {
        return this.prisma.signedConsent.create({
            data: {
                tutorId: data.tutorId,
                templateId: data.templateId,
                signatureUrl: data.signatureUrl,
                ipAddress: data.ipAddress,
                appointmentId: data.appointmentId,
                signedAt: new Date()
            }
        });
    }
}
