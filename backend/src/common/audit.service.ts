import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
    constructor(private prisma: PrismaService) {}

    async log(params: {
        clinicId: string;
        userId: string;
        action: string;
        entityType: string;
        entityId: string;
        before?: any;
        after?: any;
    }) {
        try {
            await this.prisma.auditLog.create({
                data: {
                    clinicId: params.clinicId,
                    userId: params.userId,
                    action: params.action,
                    entityType: params.entityType,
                    entityId: params.entityId,
                    beforeJson: params.before ? JSON.stringify(params.before) : null,
                    afterJson: params.after ? JSON.stringify(params.after) : null,
                }
            });
        } catch (error) {
            console.error('Failed to write audit log', error);
            // Audit failure should not block main flow? 
            // In high security apps, yes. For MVP/V1, console error is enough.
        }
    }
}
