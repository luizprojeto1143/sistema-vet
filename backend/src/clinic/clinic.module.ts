import { Module } from '@nestjs/common';
import { ClinicService } from './clinic.service';
import { ClinicController } from './clinic.controller';
import { ClinicConfigController } from './clinic-config.controller';
import { ClinicConfigService } from './clinic-config.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [ClinicController, ClinicConfigController],
    providers: [ClinicService, ClinicConfigService],
    exports: [ClinicService, ClinicConfigService]
})
export class ClinicModule { }
