import { Module } from '@nestjs/common';
import { InternmentService } from './internment.service';
import { InternmentController } from './internment.controller';
import { InternmentCronService } from './internment.cron';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductsModule } from '../products/products.module';
import { StockModule } from '../stock/stock.module';

@Module({
    imports: [PrismaModule, ProductsModule, StockModule], // StockModule for stock deduction
    controllers: [InternmentController],
    providers: [InternmentService, InternmentCronService],
})
export class InternmentModule { }
