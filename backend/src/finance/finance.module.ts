import { Module } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CommissionService } from './commission.service';
import { LedgerService } from './ledger.service';
import { StockModule } from '../stock/stock.module';

@Module({
    imports: [PrismaModule, StockModule],
    controllers: [FinanceController],
    providers: [FinanceService, CommissionService, LedgerService],
    exports: [FinanceService, CommissionService, LedgerService]
})
export class FinanceModule { }
