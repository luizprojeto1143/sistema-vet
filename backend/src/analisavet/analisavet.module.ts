import { Module } from '@nestjs/common';
import { AnalisaVetService } from './analisavet.service';
import { AnalisaVetController } from './analisavet.controller';
import { AnalisaVetTrainingController } from './analisavet-training.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [AnalisaVetController, AnalisaVetTrainingController],
    providers: [AnalisaVetService],
})
export class AnalisaVetModule { }
