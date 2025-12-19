import { Module } from '@nestjs/common';
import { AnalisaVetService } from './analisavet.service';
import { AnalisaVetController } from './analisavet.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [AnalisaVetController],
    providers: [AnalisaVetService],
})
export class AnalisaVetModule { }
