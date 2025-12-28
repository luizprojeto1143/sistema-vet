import { Module } from '@nestjs/common';
import { UpsellService } from './upsell.service';
import { SalesController } from './sales.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [UpsellService],
    controllers: [SalesController],
})
export class SalesModule { }
