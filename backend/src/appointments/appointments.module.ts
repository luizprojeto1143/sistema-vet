import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { ServicesController } from './services.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [AppointmentsController, ServicesController],
    providers: [AppointmentsService],
    exports: [AppointmentsService]
})
export class AppointmentsModule { }
