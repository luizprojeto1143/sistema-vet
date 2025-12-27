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
        // 1. Resolve Clinic (Fallback to first found)
        let clinicId = data.clinicId;
        if (!clinicId || clinicId === 'clinic-1') {
            const clinic = await this.prisma.clinic.findFirst();
            if (clinic) clinicId = clinic.id;
        }

        // 2. Resolve Vet (Fallback to first found)
        let vetId = data.vetId;
        if (!vetId || vetId === 'user-1') {
            const vet = await this.prisma.user.findFirst({ where: { clinicId } });
            if (vet) vetId = vet.id;
        }

        // 3. Resolve Service (Fallback to first found or Create Default)
        let serviceId = data.serviceId;
        if (!serviceId || serviceId === 'service-1') {
            const service = await this.prisma.service.findFirst({ where: { clinicId } });
            if (service) {
                serviceId = service.id;
            } else {
                // Create Default Service
                if (clinicId) {
                    const newService = await this.prisma.service.create({
                        data: {
                            name: 'Consulta Geral',
                            price: 150.00,
                            durationMin: 30,
                            type: 'CONSULTATION',
                            clinicId
                        }
                    });
                    serviceId = newService.id;
                }
            }
        }

        // 4. Resolve Pet/Tutor (Handle Placeholder or Missing)
        let petId = data.petId;

        // If we don't have a valid existing Pet ID, we need to create one
        if (!petId || petId === 'pet-1') {
            // Case A: Existing Tutor, New Pet
            if (data.tutorId) {
                const newPet = await this.prisma.pet.create({
                    data: {
                        name: data.patientName || 'Pet Sem Nome',
                        species: 'DOG',
                        tutorId: data.tutorId,
                        clinicId
                    }
                });
                petId = newPet.id;
            }
            // Case B: New Tutor, New Pet
            else {
                const tutor = await this.prisma.tutor.create({
                    data: {
                        fullName: data.tutorName || 'Tutor Visitante',
                        phone: data.tutorPhone || '00000000000', // Add phone support if passed
                        clinicId,
                        pets: {
                            create: {
                                name: data.patientName || 'Pet Visitante',
                                species: 'DOG',
                                clinicId
                            }
                        }
                    },
                    include: { pets: true }
                });
                petId = tutor.pets[0].id;
            }
        }

        // Validate Critical IDs
        if (!clinicId || !petId) {
            throw new Error(`Failed to resolve Clinic (${clinicId}) or Pet (${petId}). Ensure system is initialized.`);
        }

        // Handle Recurrence (Simple: Weekly for N weeks)
        // data.recurrence = { frequency: 'WEEKLY', times: 4 }

        if (data.recurrence && data.recurrence.times > 1) {
            const appointments = [];
            let currentDate = new Date(data.dateTime);

            for (let i = 0; i < data.recurrence.times; i++) {
                appointments.push(this.prisma.appointment.create({
                    data: {
                        date: new Date(currentDate),
                        type: data.type,
                        status: 'SCHEDULED',
                        notes: i > 0 ? `${data.notes} (Recorrência ${i + 1}/${data.recurrence.times})` : data.notes,
                        petId,
                        vetId,
                        clinicId,
                        serviceId
                    }
                }));
                // Add 7 days
                currentDate.setDate(currentDate.getDate() + 7);
            }
            return Promise.all(appointments);
        }

        // Single Appointment
        const appointment = await this.prisma.appointment.create({
            data: {
                date: new Date(data.dateTime),
                type: data.type,
                status: 'SCHEDULED',
                notes: data.notes,
                petId,
                vetId,
                clinicId,
                serviceId // Can be optional in schema? Schema says optional `serviceId String?`
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

    async findAll(clinicId: string) {
        return this.prisma.appointment.findMany({
            where: { clinicId },
            include: {
                pet: { include: { tutor: true } },
                vet: true,
                service: true,
                medicalRecord: {
                    include: {
                        // consumedItems: true // Scalar field, included by default
                    }
                }
            },
            orderBy: { date: 'asc' }
        });
    }

    async update(id: string, data: any) {
        return this.prisma.appointment.update({
            where: { id },
            data
        });
    }

    async updateStatus(id: string, status: string) {
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
