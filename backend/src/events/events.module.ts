
import { Module, Global } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MedicalRecordListener } from './listeners/medical-record.listener';
import { AppointmentsModule } from '../appointments/appointments.module';
import { PrismaModule } from '../prisma/prisma.module';

@Global()
@Module({
    imports: [
        EventEmitterModule.forRoot(),
        AppointmentsModule,
        PrismaModule
    ],
    providers: [MedicalRecordListener],
    exports: [],
})
export class EventsModule { }
