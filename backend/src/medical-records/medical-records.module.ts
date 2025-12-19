import { Module } from '@nestjs/common';
import { MedicalRecordsService } from './medical-records.service';
import { MedicalRecordsController } from './medical-records.controller';
import { AutoLockService } from './auto-lock.service';
import { PrismaModule } from '../prisma/prisma.module';

import { ProductsModule } from '../products/products.module';
import { FinanceModule } from '../finance/finance.module';
import { AppointmentsModule } from '../appointments/appointments.module';

@Module({
    imports: [PrismaModule, ProductsModule, FinanceModule, AppointmentsModule],
    controllers: [MedicalRecordsController],
    providers: [MedicalRecordsService, AutoLockService],
})
export class MedicalRecordsModule { }
