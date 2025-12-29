import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AppointmentsService {
    constructor(
        private prisma: PrismaService,
        private notifications: NotificationsService
    ) { }

    async create(data: any) {
        const clinicId = data.clinicId;
        if (!clinicId) throw new Error('Clinic ID is required for Appointments');

        // 2. Resolve Vet (Fallback to first found IN CLINIC)
        let vetId = data.vetId;
        if (!vetId) {
            // Optional: Logic to assign a default vet if needed, or leave null if schema allows
            const vet = await this.prisma.user.findFirst({ where: { clinicId, role: 'VET' } });
            if (vet) vetId = vet.id;
        }

        // 3. Resolve Service (Specific to Clinic)
        let serviceId = data.serviceId;
        if (!serviceId) {
            const service = await this.prisma.service.findFirst({ where: { clinicId } });
            if (service) {
                serviceId = service.id;
            } else {
                // Auto-create basic service if completely empty
                const newService = await this.prisma.service.create({
                    data: { name: 'Consulta Geral', price: 150.00, durationMin: 30, type: 'CONSULTATION', clinicId }
                });
                serviceId = newService.id;
            }
        }

        // 4. Resolve Pet/Tutor
        let petId = data.petId;
        if (!petId) throw new Error('Pet ID is required');

        // Verify Pet belongs to Clinic
        const pet = await this.prisma.pet.findFirst({ where: { id: petId, clinicId } });
        if (!pet) throw new Error('Pet not found in this clinic');

        // Create Appointment
        const appointment = await this.prisma.appointment.create({
            data: {
                date: new Date(data.dateTime),
                type: data.type,
                status: 'SCHEDULED',
                notes: data.notes,
                petId,
                vetId,
                clinicId,
                serviceId
            },
            include: {
                pet: { include: { tutor: true } },
                vet: true
            }
        });

        // Trigger Notification (Async)
        this.notifications.sendAppointmentConfirmation(appointment).catch(err => console.error("Notification Error", err));
        return appointment;
    }

    async findOne(id: string, clinicId: string) {
        const appointment = await this.prisma.appointment.findFirst({
            where: { id, clinicId },
            include: {
                pet: { include: { tutor: true } },
                vet: true,
                service: true,
                medicalRecord: true
            }
        });
        if (!appointment) throw new Error('Appointment not found or access denied');
        return appointment;
    }

    async findAll(clinicId: string) {
        return this.prisma.appointment.findMany({
            where: { clinicId },
            include: {
                pet: { include: { tutor: true } },
                vet: true,
                service: true,
                medicalRecord: true // Removed heavy includes
            },
            orderBy: { date: 'asc' }
        });
    }

    async update(id: string, data: any, clinicId: string) {
        const appointment = await this.prisma.appointment.findFirst({ where: { id, clinicId } });
        if (!appointment) throw new Error('Appointment not found or access denied');

        return this.prisma.appointment.update({
            where: { id },
            data
        });
    }

    async updateStatus(id: string, status: string, clinicId: string) {
        const appointment = await this.prisma.appointment.findFirst({ where: { id, clinicId } });
        if (!appointment) throw new Error('Appointment not found or access denied');

        return this.prisma.appointment.update({
            where: { id },
            data: { status }
        });
    }

    async getAvailableSlots(clinicId: string, dateStr: string, vetId?: string, serviceId?: string) {
        // 1. Get Clinic Operating Hours
        const clinic = await this.prisma.clinic.findUnique({ where: { id: clinicId } });
        if (!clinic || !clinic.operatingHours) return [];

        const operatingHours = JSON.parse(clinic.operatingHours);
        const date = new Date(dateStr);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase(); // monday, tuesday...

        const schedule = operatingHours[dayOfWeek];
        if (!schedule || schedule.closed) return []; // Clinic closed

        // 2. Determine Slot Duration (Service Duration or Default 30min)
        let slotDuration = 30;
        if (serviceId) {
            const service = await this.prisma.service.findUnique({ where: { id: serviceId } });
            if (service) slotDuration = service.durationMin;
        }

        // 3. Generate All Potential Slots
        const slots = [];
        let [startHour, startMin] = schedule.start.split(':').map(Number);
        let [endHour, endMin] = schedule.end.split(':').map(Number);

        let current = new Date(date);
        current.setHours(startHour, startMin, 0, 0);

        const end = new Date(date);
        end.setHours(endHour, endMin, 0, 0);

        while (current < end) {
            slots.push(new Date(current));
            current.setMinutes(current.getMinutes() + slotDuration);
        }

        // 4. Fetch Existing Appointments (Optimized: Filter by day)
        const dayStart = new Date(date); dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date); dayEnd.setHours(23, 59, 59, 999);

        const where: any = {
            clinicId,
            date: { gte: dayStart, lte: dayEnd },
            status: { notIn: ['CANCELED', 'MISSED'] }
        };
        if (vetId) where.vetId = vetId;

        const appointments = await this.prisma.appointment.findMany({ where });

        // 5. Filter Occupied Slots
        // Simple logic: If slot start time == appointment start time, it's busy.
        // Advanced: Overlap check. keeping it simple for V1.

        const availableSlots = slots.filter(slot => {
            const slotTime = slot.getTime();
            // Check if any appointment conflicts
            return !appointments.some(appt => {
                const apptStart = new Date(appt.date).getTime();
                // Assuming appointment duration is same as slot or we check overlap
                // For MVP: Strict start match
                return Math.abs(apptStart - slotTime) < 60000; // 1 min tolerance
            });
        });

        return availableSlots.map(s => s.toTimeString().slice(0, 5)); // Return ["09:00", "09:30"]
    }
}
