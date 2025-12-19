import { StockService } from '../stock/stock.service';

import { LedgerService } from './ledger.service';

@Injectable()
export class FinanceService {
    constructor(
        private prisma: PrismaService,
        private commissionService: CommissionService,
        private stockService: StockService,
        private ledgerService: LedgerService
    ) { }

    async create(data: any) {
        // 1. Create Transaction
        const transaction = await this.prisma.financialTransaction.create({
            data: {
                type: data.type, // INCOME, EXPENSE
                amount: data.amount,
                description: data.description,
                category: data.category,
                paymentMethod: data.paymentMethod,
                status: data.status || 'COMPLETED',
                clinicId: data.clinicId,
                tutorId: data.tutorId,
                platformFee: data.platformFee // Ensure this is saved if provided
            }
        });

        // 2. Process Splits (Commissions)
        if (data.splitRules && Array.isArray(data.splitRules) && data.splitRules.length > 0) {
            for (const split of data.splitRules) {
                await this.commissionService.logCommission({
                    clinicId: data.clinicId,
                    providerId: split.providerId,
                    serviceId: null, // Custom Split
                    amountBase: Number(split.amount),
                    commissionRate: 100, // 100% of the split amount goes to provider
                    commissionValue: Number(split.amount),
                    transactionId: transaction.id
                });
            }
        }

        // 3. Process Stock (Sales)
        if (data.items && Array.isArray(data.items) && data.items.length > 0) {
            for (const item of data.items) {
                if (item.productId && item.quantity) {
                    await this.stockService.manualConsume({
                        clinicId: data.clinicId,
                        productId: item.productId,
                        quantity: Number(item.quantity),
                        reason: `Venda #Tx-${transaction.id.slice(0, 8)}`,
                        userId: 'system' // or pass userId from controller
                    });
                }
            }
        }

        // 4. Double Entry Accounting (Ledger)
        if (transaction.status === 'COMPLETED') {
            try {
                // Find or Create Default Accounts (Simple Implementation)
                // In production, these should be configured per clinic.
                const bankAccountName = 'Caixa/Banco';
                let bankAccount = await this.prisma.ledgerAccount.findFirst({ where: { clinicId: data.clinicId, name: bankAccountName } });
                if (!bankAccount) {
                    bankAccount = await this.ledgerService.createAccount({ clinicId: data.clinicId, name: bankAccountName, type: 'ASSET' });
                }

                if (data.type === 'INCOME') {
                    // Credit Revenue
                    const revenueAccountName = data.category || 'Receita de Serviços';
                    let revenueAccount = await this.prisma.ledgerAccount.findFirst({ where: { clinicId: data.clinicId, name: revenueAccountName } });
                    if (!revenueAccount) {
                        revenueAccount = await this.ledgerService.createAccount({ clinicId: data.clinicId, name: revenueAccountName, type: 'REVENUE' });
                    }

                    await this.ledgerService.recordEntry({
                        description: `Receita: ${data.description}`,
                        amount: Number(data.amount),
                        debitAccountId: bankAccount.id, // Cash increases (Debit)
                        creditAccountId: revenueAccount.id, // Revenue increases (Credit)
                        clinicId: data.clinicId,
                        financialTransactionId: transaction.id
                    });

                } else if (data.type === 'EXPENSE') {
                    // Debit Expense
                    const expenseAccountName = data.category || 'Despesas Gerais';
                    let expenseAccount = await this.prisma.ledgerAccount.findFirst({ where: { clinicId: data.clinicId, name: expenseAccountName } });
                    if (!expenseAccount) {
                        expenseAccount = await this.ledgerService.createAccount({ clinicId: data.clinicId, name: expenseAccountName, type: 'EXPENSE' });
                    }

                    await this.ledgerService.recordEntry({
                        description: `Despesa: ${data.description}`,
                        amount: Number(data.amount),
                        debitAccountId: expenseAccount.id, // Expense increases (Debit)
                        creditAccountId: bankAccount.id, // Cash decreases (Credit)
                        clinicId: data.clinicId,
                        financialTransactionId: transaction.id
                    });
                }
            } catch (err) {
                console.error('Ledger Error (Non-blocking):', err);
            }
        }

        return transaction;
    }

    async createPaymentPreference(clinicId: string, transactionData: any) {
        const clinic = await this.prisma.clinic.findUnique({ where: { id: clinicId } });
        if (!clinic) throw new Error('Clinic not found');

        const totalAmount = Number(transactionData.amount);
        let remainingForClinic = totalAmount;

        // 1. Calculate Platform Fee (SaaS)
        // If clinic is accepting hardware offer, maybe fee is higher, but lets stick to standard
        const platformRate = clinic.platformFeeRate || 5.0;
        const platformFee = (totalAmount * platformRate) / 100;

        // In MP Split, the platform fee usually is charged to the primary receiver (Clinic)
        // receiving the 'net' amount, OR we set 'marketplace_fee'

        remainingForClinic -= platformFee;

        // 2. Calculate Provider Splits (Multi-Vendor)
        const secondaryReceivers = [];

        if (transactionData.items && Array.isArray(transactionData.items)) {
            for (const item of transactionData.items) {
                if (item.type === 'SERVICE' && item.providerId) {
                    // Check if there is a specific rule
                    const rule = await this.prisma.commissionRule.findFirst({
                        where: {
                            clinicId,
                            providerId: item.providerId,
                            serviceId: item.serviceId
                        }
                    });

                    // Fetch Provider to get MP Account ID
                    const provider = await this.prisma.user.findUnique({ where: { id: item.providerId } });

                    if (provider && provider.mpRecipientId) {
                        let providerShare = 0;
                        const itemPrice = Number(item.price);

                        if (rule) {
                            if (rule.ruleType === 'FIXED_PROVIDER_VALUE' && rule.providerFixedValue) {
                                providerShare = Number(rule.providerFixedValue);
                            } else if (rule.ruleType === 'PERCENTAGE_CLINIC_MARGIN' && rule.clinicMarginPercent) {
                                // Clinic keeps X%, Provider gets (100 - X)%
                                const providerPercent = 100 - rule.clinicMarginPercent;
                                providerShare = (itemPrice * providerPercent) / 100;
                            }
                        } else if (provider.commissionRate) {
                            // Fallback to generic commission rate
                            providerShare = (itemPrice * provider.commissionRate) / 100;
                        }

                        if (providerShare > 0) {
                            secondaryReceivers.push({
                                accountId: provider.mpRecipientId,
                                amount: providerShare,
                                reason: `Comissão: ${item.name}`
                            });
                            remainingForClinic -= providerShare;
                        }
                    }
                }
            }
        }

        // Safety check
        if (remainingForClinic < 0) {
            throw new Error('Split calculation error: Distributions exceed total amount');
        }

        return {
            preferenceId: `pref_${Date.now()}_mock`,
            splitDetails: {
                total: totalAmount,
                platformFee: platformFee.toFixed(2),
                platformRate,
                providers: secondaryReceivers,
                clinicNet: remainingForClinic.toFixed(2)
            },
            initPoint: 'https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=mock'
        };
    }

    async getCashierHistory(clinicId: string) {
        return this.prisma.cashierSession.findMany({
            where: { clinicId, status: 'CLOSED' },
            orderBy: { closedAt: 'desc' },
            include: { openedByUser: true },
            take: 20 // Last 20 sessions for now
        });
    }

    async findAll(clinicId: string, query?: any) {
        const where: any = { clinicId };
        if (query?.status) where.status = query.status;
        if (query?.type) where.type = query.type;
        if (query?.tutorId) where.tutorId = query.tutorId;

        return this.prisma.financialTransaction.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                tutor: true
            }
        });
    }

    async cancelTransaction(id: string, userId: string) {
        // Find transaction
        const tx = await this.prisma.financialTransaction.findUnique({ where: { id } });
        if (!tx) throw new new Error('Transaction not found');
        if (tx.status === 'CANCELED') throw new Error('Already canceled');

        // Check if cashier is closed? Ideally yes, but let's allow admin override.

        return this.prisma.financialTransaction.update({
            where: { id },
            data: {
                status: 'CANCELED',
                description: `[CANCELADO] ${tx.description}`
            }
        });
    }

    async getFinancialDashboard(clinicId: string, startDate?: Date, endDate?: Date) {
        // Construct date filter
        const dateFilter: any = {};
        if (startDate) dateFilter.gte = startDate;
        if (endDate) dateFilter.lte = endDate;

        const where: any = {
            clinicId,
            status: 'COMPLETED'
        };

        if (startDate || endDate) {
            where.createdAt = dateFilter;
        }

        const transactions = await this.prisma.financialTransaction.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        // 1. Totals
        const income = transactions
            .filter(t => t.type === 'INCOME')
            .reduce((acc, curr) => acc + Number(curr.amount), 0);

        const expenses = transactions
            .filter(t => t.type === 'EXPENSE')
            .reduce((acc, curr) => acc + Number(curr.amount), 0);

        // 2. Net Profit
        const profit = income - expenses;

        // 3. Platform Fees (Cost of SaaS)
        const platformFees = transactions
            .reduce((acc, curr) => acc + Number(curr.platformFee || 0), 0);

        // 4. Group by Day (Chart Data)
        const chartData = this.groupByDay(transactions);

        // 5. Recent Transactions
        const recent = transactions.slice(0, 5);

        return {
            summary: {
                totalRevenue: income,
                totalExpenses: expenses,
                netProfit: profit,
                platformFeesPaid: platformFees,
                margin: income > 0 ? ((profit / income) * 100).toFixed(1) : 0
            },
            chartData,
            recentTransactions: recent
        };
    }

    private groupByDay(transactions: any[]) {
        const map = new Map();

        transactions.forEach(t => {
            const day = t.createdAt.toISOString().split('T')[0]; // YYYY-MM-DD
            if (!map.has(day)) map.set(day, { date: day, income: 0, expense: 0 });

            const entry = map.get(day);
            if (t.type === 'INCOME') entry.income += Number(t.amount);
            if (t.type === 'EXPENSE') entry.expense += Number(t.amount);
        });

        // Convert to array and sort
        return Array.from(map.values()).sort((a: any, b: any) => a.date.localeCompare(b.date));
    }

    // ------------------------------------------------
    // COMMISSION / PROVIDER RULES
    // ------------------------------------------------
    async createCommissionRule(clinicId: string, data: any) {
        return this.prisma.commissionRule.create({
            data: {
                ...data,
                clinicId
            }
        });
    }

    async getCommissionRules(clinicId: string) {
        return this.prisma.commissionRule.findMany({
            where: { clinicId },
            include: {
                provider: { select: { fullName: true, id: true } },
                service: { select: { name: true, salePrice: true, id: true } }
            }
        });
    }

    async deleteCommissionRule(id: string) {
        return this.prisma.commissionRule.delete({ where: { id } });
    }
}
