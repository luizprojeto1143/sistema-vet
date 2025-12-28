import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TimelineService {
    constructor(private prisma: PrismaService) { }

    async getPetTimeline(petId: string) {
        // 1. Get Appointments
        const appointments = await this.prisma.appointment.findMany({
            where: { petId },
            orderBy: { date: 'desc' },
            take: 5
        });

        // 2. Get Internment Logs (if high severity)
        const internments = await this.prisma.internment.findMany({
            where: { petId, status: 'ACTIVE' },
            include: { logs: { orderBy: { date: 'desc' } } }
        });

        // 3. Normalize into "Timeline Events"
        const timeline = [];

        // Add Appointment events
        for (const appt of appointments) {
            timeline.push({
                id: appt.id,
                date: appt.date,
                title: this.mapStatusTitle(appt.status),
                description: appt.notes || `Agendamento de ${appt.type}`,
                type: 'APPOINTMENT',
                status: appt.status
            });
        }

        // Add Internment logs
        for (const int of internments) {
            for (const log of int.logs) {
                timeline.push({
                    id: log.id,
                    date: log.date,
                    title: 'Atualização Clínica', // Could be smarter
                    description: log.description,
                    type: 'INTERNMENT',
                    status: 'INFO'
                });
            }
        }

        // Sort by date desc
        return timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    private mapStatusTitle(status: string) {
        const map = {
            'SCHEDULED': 'Agendado',
            'CHECKED_IN': 'Chegou na Clínica',
            'IN_PROGRESS': 'Em Atendimento',
            'COMPLETED': 'Finalizado/Alta',
            'CANCELED': 'Cancelado'
        };
        return map[status] || status;
    }
}
