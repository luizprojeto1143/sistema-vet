import { Module } from '@nestjs/common';
import { ClinicService } from './clinic.service';
import { ClinicController } from './clinic.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [ClinicController, ClinicConfigController],
    providers: [ClinicService, ClinicConfigService],
    exports: [ClinicService, ClinicConfigService]
})
export class ClinicModule { }
