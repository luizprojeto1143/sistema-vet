import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditInterceptor } from './common/audit.interceptor';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ClinicModule } from './clinic/clinic.module';
import { UserModule } from './user/user.module';
import { PetsModule } from './pets/pets.module';
import { TutorsModule } from './tutors/tutors.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { MedicalRecordsModule } from './medical-records/medical-records.module';
import { ProductsModule } from './products/products.module';
import { FinanceModule } from './finance/finance.module';
import { AnalisaVetModule } from './analisavet/analisavet.module';
import { InternmentModule } from './internment/internment.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RolesModule } from './roles/roles.module';
import { GrowthModule } from './growth/growth.module';
import { StockModule } from './stock/stock.module';
import { SaasModule } from './saas/saas.module';
import { NotificationModule } from './common/notification.module';
import { UploadController } from './common/upload.controller';
import { TelemedicineModule } from './telemedicine/telemedicine.module';
import { EventsModule } from './events/events.module';
import { FiscalModule } from './fiscal/fiscal.module';
import { NotificationsModule } from './notifications/notifications.module';

import { AuditController } from './common/audit.controller';

import { AppController } from './app.controller';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        PrismaModule,
        AuthModule,
        ClinicModule,
        UserModule,
        PetsModule,
        TutorsModule,
        AppointmentsModule,
        MedicalRecordsModule,
        ProductsModule,
        FinanceModule,
        StockModule,
        AnalisaVetModule,
        InternmentModule,
        SaasModule,
        RolesModule,
        NotificationModule,
        GrowthModule,
        TelemedicineModule,
        EventsModule,
        FiscalModule,
        NotificationsModule
    ],
    controllers: [AppController, UploadController, AuditController],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: AuditInterceptor,
        },
    ],
})
export class AppModule { }
