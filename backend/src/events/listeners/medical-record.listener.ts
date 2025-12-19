
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AppointmentsService } from '../../appointments/appointments.service';
import { PrismaService } from '../../prisma/prisma.service';

export class MedicalRecordCreatedEvent {
    constructor(
        public readonly recordId: string,
        public readonly consumedItems: any[], // { productId, name... }
        public readonly petId: string,
        public readonly vetId: string,
        public readonly clinicId: string
    ) { }
}

@Injectable()
export class MedicalRecordListener {
    private readonly logger = new Logger(MedicalRecordListener.name);

    constructor(
        private appointmentsService: AppointmentsService,
        private prisma: PrismaService
    ) { }

    @OnEvent('medical-record.created')
    async handleMedicalRecordCreated(event: MedicalRecordCreatedEvent) {
        this.logger.log(`Handling Medical Record Created: verifying vaccines for Pet ${event.petId}`);

        if (!event.consumedItems || event.consumedItems.length === 0) return;

        for (const item of event.consumedItems) {
            if (item.productId) {
                try {
                    const product = await this.prisma.product.findUnique({ where: { id: item.productId } });

                    if (product && product.boosterIntervalDays) {
                        const boosterDate = new Date();
                        boosterDate.setDate(boosterDate.getDate() + product.boosterIntervalDays);

                        await this.appointmentsService.create({
                            dateTime: boosterDate.toISOString(),
                            type: 'VACCINE',
                            notes: `Reforço Automático: ${product.name}`,
                            petId: event.petId,
                            vetId: event.vetId,
                            clinicId: event.clinicId,
                            serviceId: null
                        });
                        this.logger.log(`[Auto-Schedule] Booster for ${product.name} scheduled.`);
                    }
                } catch (e) {
                    this.logger.warn(`Failed to process auto-schedule for item ${item.productId}`, e);
                }
            }
        }
    }
}
