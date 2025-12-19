import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationService {
    constructor(private prisma: PrismaService) { }

    async create(data: { clinicId: string; title: string; message: string; type: 'ALERT' | 'INFO' | 'SUCCESS' | 'WARNING' }) {
        return this.prisma.notification.create({
            data: {
                clinicId: data.clinicId,
                title: data.title,
                message: data.message,
                type: data.type
            }
        });
    }

    async getForClinic(clinicId: string) {
        return this.prisma.notification.findMany({
            where: { clinicId, read: false },
            orderBy: { createdAt: 'desc' },
            take: 20
        });
    }

    async markAsRead(id: string) {
        return this.prisma.notification.update({
            where: { id },
            data: { read: true }
        });
    }
}
