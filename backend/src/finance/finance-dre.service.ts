import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FinanceDREService {
    constructor(private prisma: PrismaService) { }

    async getDRE(clinicId: string, startDate: Date, endDate: Date) {
        // 1. Gross Revenue (Service + Product Sales)
        const income = await this.prisma.financialTransaction.aggregate({
            where: { clinicId, type: 'INCOME', createdAt: { gte: startDate, lte: endDate } },
            _sum: { amount: true }
        });

        // 2. Variable Costs (Taxes, Commissions, COGS)
        // Mocking COGS as 40% of Product Sales for now
        // Ideally we sum 'EXPENSE' with category 'COST'
        const expenses = await this.prisma.financialTransaction.aggregate({
            where: { clinicId, type: 'EXPENSE', createdAt: { gte: startDate, lte: endDate } },
            _sum: { amount: true }
        });

        const grossRevenue = Number(income._sum.amount || 0);
        const totalExpenses = Number(expenses._sum.amount || 0);

        // Mock Tax (Simples Nacional ~6-15%)
        const taxes = grossRevenue * 0.10;

        // Net Profit
        const netProfit = grossRevenue - totalExpenses - taxes;
        const margin = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;

        return {
            grossRevenue,
            deductions: {
                taxes,
                commissions: 0, // Should come from CommissionService
                returns: 0
            },
            netRevenue: grossRevenue - taxes,
            costs: totalExpenses,
            netProfit,
            margin
        };
    }
}
