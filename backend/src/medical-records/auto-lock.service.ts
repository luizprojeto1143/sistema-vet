
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AutoLockService {
    private readonly logger = new Logger(AutoLockService.name);

    constructor(private prisma: PrismaService) { }

    @Cron(CronExpression.EVERY_HOUR)
    async handleCron() {
        this.logger.debug('Checking for records to auto-lock...');

        const cutoff = new Date();
        cutoff.setHours(cutoff.getHours() - 24);

        // Find unlocked records older than 24h
        const records = await this.prisma.medicalRecord.count({
            where: {
                locked: false,
                createdAt: { lt: cutoff }
            }
        });

        if (records > 0) {
            const result = await this.prisma.medicalRecord.updateMany({
                where: {
                    locked: false,
                    createdAt: { lt: cutoff }
                },
                data: {
                    locked: true,
                    lockedAt: new Date()
                }
            });
            this.logger.log(`Auto-locked ${result.count} medical records.`);
        }
    }
}
