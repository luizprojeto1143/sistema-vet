import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

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
                    clinicId: data.clinicId,
                    userId: data.userId,
                    action: data.action,
                    entity: data.entity,
                    entityId: data.entityId,
                    oldValue: data.oldValue ?? Prisma.JsonNull,
                    newValue: data.newValue ?? Prisma.JsonNull,
                    ipAddress: data.ipAddress,
                    userAgent: data.userAgent
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
                    select: { fullName: true, email: true }
                }
            }
        });
    }
}
