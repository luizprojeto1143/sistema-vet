import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
    constructor(private prisma: PrismaService) { }

    async log(data: {
        clinicId: string;
        userId?: string;
        action: string;
        entity: string;
        entityId: string;
        oldValue?: any;
        newValue?: any;
        ipAddress?: string;
        userAgent?: string;
    }) {
        try {
            await this.prisma.auditLog.create({
                data: {
                    ...data,
                    oldValue: data.oldValue ? JSON.stringify(data.oldValue) : null,
                    newValue: data.newValue ? JSON.stringify(data.newValue) : null,
                },
            });
        } catch (error) {
            console.error('Failed to create audit log', error);
            // Don't throw error to avoid blocking the main transaction
        }
    }

    async findAll(clinicId: string, limit = 50) {
        return this.prisma.auditLog.findMany({
            where: { clinicId },
            orderBy: { timestamp: 'desc' },
            take: limit,
            include: {
                user: {
                    select: { name: true, email: true }
                }
            }
        });
    }
}
