import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClinicConfigService {
    constructor(private prisma: PrismaService) { }

    async updateIdentity(clinicId: string, data: any) {
        return this.prisma.clinic.update({
            where: { id: clinicId },
            data: {
                name: data.name,
                address: data.address,
                phone: data.phone,
                email: data.email,
                website: data.website,
                logoUrl: data.logoUrl,
                operatingHours: data.opensAt // JSON
            }
        });
    }

    async toggleModule(clinicId: string, moduleKey: string, isEnabled: boolean) {
        const clinic = await this.prisma.clinic.findUnique({ where: { id: clinicId } });
        if (!clinic) throw new BadRequestException('Clinic not found');

        // VALIDATION LOGIC
        if (isEnabled) {
            // Activation Checks
            if (moduleKey === 'hasFiscal' && !clinic.cnpj) {
                throw new BadRequestException('Cannot enable Fiscal module without CNPJ set in Identity.');
            }
        } else {
            // Deactivation Checks (Safety)
            if (moduleKey === 'hasInternment') {
                const activeInternments = await this.prisma.internment.count({
                    where: { clinicId, status: 'ACTIVE' }
                });
                if (activeInternments > 0) {
                    throw new BadRequestException(`Cannot disable Internment: ${activeInternments} active patients found.`);
                }
            }
        }

        // DYNAMIC UPDATE
        const updateData = {};
        updateData[moduleKey] = isEnabled;

        return this.prisma.clinic.update({
            where: { id: clinicId },
            data: updateData
        });
    }

    async getFlags(clinicId: string) {
        const clinic = await this.prisma.clinic.findUnique({
            where: { id: clinicId },
            select: {
                hasClinical: true,
                hasAgenda: true,
                hasInternment: true,
                hasHomeCare: true,
                hasPetshopService: true,
                hasPetshopRetail: true,
                hasStockAdvanced: true,
                hasFinancial: true,
                hasFiscal: true,
                hasContabil: true,
                hasAI: true,
                hasAppTutor: true,
                hasNPS: true
            }
        });
        return clinic;
    }
}
