
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LedgerService {
    private readonly logger = new Logger(LedgerService.name);

    constructor(private prisma: PrismaService) { }

    /**
     * Creates a new Account in the Chart of Accounts
     */
    async createAccount(data: { name: string; type: string; code?: string; clinicId: string }) {
        return this.prisma.ledgerAccount.create({ data });
    }

    /**
     * Records a Double Entry Transaction (Debit & Credit)
     * A = L + E + (Rev - Exp)
     * Assets/Expenses increase with Debit.
     * Liabilities/Equity/Revenue increase with Credit.
     */
    async recordEntry(data: {
        description: string;
        amount: number;
        debitAccountId: string;
        creditAccountId: string;
        clinicId: string;
        financialTransactionId?: string;
        date?: Date;
    }) {
        if (data.amount <= 0) throw new BadRequestException('Amount must be positive');
        if (data.debitAccountId === data.creditAccountId) throw new BadRequestException('Debit and Credit accounts must be different');

        return this.prisma.$transaction(async (tx) => {
            // 1. Create Entry
            const entry = await tx.ledgerEntry.create({
                data: {
                    description: data.description,
                    amount: data.amount,
                    debitAccountId: data.debitAccountId,
                    creditAccountId: data.creditAccountId,
                    clinicId: data.clinicId,
                    financialTransactionId: data.financialTransactionId,
                    transactionDate: data.date || new Date(),
                }
            });

            // 2. Update Account Balances (Denormalization for speed)
            // Debit: Increases balance if Asset/Expense, decreases if Liability/Equity/Revenue?
            // Actually, "Balance" usually means "Net Value" (Debit - Credit).

            // Debit Account (+DB)
            await tx.ledgerAccount.update({
                where: { id: data.debitAccountId },
                data: { balance: { increment: data.amount } }
            });

            // Credit Account (+CR, effectively -DB if we view everything as asset-centric, but usually we just track CR sum)
            // Let's keep simple: Balance = Debits - Credits.
            // So Credit decreases the balance.
            await tx.ledgerAccount.update({
                where: { id: data.creditAccountId },
                data: { balance: { decrement: data.amount } }
            });

            return entry;
        });
    }

    async getBalance(accountId: string) {
        const account = await this.prisma.ledgerAccount.findUnique({ where: { id: accountId } });
        return account?.balance || 0;
    }

    async getTrialBalance(clinicId: string) {
        return this.prisma.ledgerAccount.findMany({
            where: { clinicId },
            orderBy: { code: 'asc' }
        });
    }
}
