import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InternmentCronService {
    private readonly logger = new Logger(InternmentCronService.name);

    constructor(private prisma: PrismaService) { }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleDailyCharges() {
        this.logger.debug('Running Daily Internment Charges...');

        // 1. Get all Active Internments with Clinic Config
        const activeInternments = await this.prisma.internment.findMany({
            where: { status: 'ACTIVE' },
            include: {
                pet: { include: { tutor: true } },
                clinic: true // Include Clinic to get the rate
            }
        });

        if (activeInternments.length === 0) {
            this.logger.debug('No active internments found to charge.');
            return;
        }

        for (const internment of activeInternments) {
            // Use clinic-specific rate or default fallback
            const dailyRate = Number(internment.clinic?.internmentDailyRate) || 150.00;

            this.logger.log(`Charging daily rate (${dailyRate}) for ${internment.pet.name}`);

            await this.prisma.financialTransaction.create({
                data: {
                    type: 'INCOME',
                    category: 'INTERNMENT',
                    amount: dailyRate,
                    description: `Diária de Internação - ${internment.pet.name} - ${new Date().toLocaleDateString()}`,
                    status: 'PENDING',
                    tutorId: internment.pet.tutorId,
                    clinicId: internment.clinicId,
                }
            });
        }
    }
}
