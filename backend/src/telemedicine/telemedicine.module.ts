
import { Module } from '@nestjs/common';
import { TelemedicineController } from './telemedicine.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [TelemedicineController],
})
export class TelemedicineModule { }
