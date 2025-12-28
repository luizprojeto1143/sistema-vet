import { Module } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CommissionService } from './commission.service';
import { LedgerService } from './ledger.service';
import { StockModule } from '../stock/stock.module';

import { FinanceDREController } from './finance-dre.controller';
import { FinanceDREService } from './finance-dre.service';

@Module({
    imports: [PrismaModule, StockModule],
    controllers: [FinanceController, FinanceDREController],
    providers: [FinanceService, CommissionService, LedgerService, FinanceDREService],
    exports: [FinanceService, CommissionService, LedgerService]
})
export class FinanceModule { }
