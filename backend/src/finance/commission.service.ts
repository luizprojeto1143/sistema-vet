import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommissionService {
    constructor(private prisma: PrismaService) { }

    /**
     * Calculates the split for a given service execution.
     * Determines how much goes to the Provider and how much stays with the Clinic.
     */
    async calculateSplit(clinicId: string, providerId: string, serviceId: string, salePrice: number) {
        // 1. Find Specific Rule
        const rule = await this.prisma.commissionRule.findFirst({
            where: {
                clinicId,
                providerId,
                serviceId
            }
        });

        // Default: 100% to Clinic if no rule exists (Provider is employee with salary)
        if (!rule) {
            return {
                providerAmount: 0,
                clinicAmount: salePrice,
                ruleApplied: 'DEFAULT_NO_RULE',
                clinicNet: salePrice
            };
        }

        let providerAmount = 0;
        let clinicAmount = 0;

        if (rule.ruleType === 'FIXED_PROVIDER_VALUE') {
            providerAmount = Number(rule.providerFixedValue || 0);
            clinicAmount = salePrice - providerAmount;
        } else if (rule.ruleType === 'PERCENTAGE_CLINIC_MARGIN') {
            const marginPercent = rule.clinicMarginPercent || 0;
            clinicAmount = (salePrice * marginPercent) / 100;
            providerAmount = salePrice - clinicAmount;
        }

        // Safety check: Clinic cannot get less than 0 (subsidized service?)
        // Maybe yes, but let's assume standard logic.

        return {
            providerAmount: Number(providerAmount.toFixed(2)),
            clinicAmount: Number(clinicAmount.toFixed(2)),
            ruleApplied: rule.ruleType,
            ruleId: rule.id
        };
    }

    /**
     * Simulates a transaction split before capturing payment.
     * Use this to show "Estimated Split" in the frontend.
     */
    async simulateTransactionSplit(clinicId: string, items: any[]) {
        const splits = [];

        for (const item of items) {
            if (item.type === 'SERVICE' && item.providerId) {
                const split = await this.calculateSplit(clinicId, item.providerId, item.serviceId, item.price);
                splits.push({
                    itemId: item.id,
                    ...split
                });
            } else {
                // Products or no-provider services = 100% Clinic
                splits.push({
                    itemId: item.id,
                    providerAmount: 0,
                    clinicAmount: item.price,
                    ruleApplied: 'PRODUCT_OR_DEFAULT'
                });
            }
        }

        return {
            totalProvider: splits.reduce((acc, curr) => acc + curr.providerAmount, 0),
            totalClinic: splits.reduce((acc, curr) => acc + curr.clinicAmount, 0),
            details: splits
        };
    }

    /**
     * Records the commission log for a completed transaction item.
     * Should be called when a payment is confirmed.
     */
    async logCommission(clinicId: string, item: any) {
        if (item.type !== 'SERVICE' || !item.providerId) return null;

        const split = await this.calculateSplit(clinicId, item.providerId, item.serviceId, item.price);

        return this.prisma.commissionLog.create({
            data: {
                clinicId,
                providerId: item.providerId,
                serviceName: item.serviceName || 'Serviço',
                salePrice: item.price,
                providerAmount: split.providerAmount,
                clinicAmount: split.clinicAmount,
                status: 'PENDING'
            }
        });
    }

    /**
     * Aggregates commission data for the dashboard.
     */
    async getCommissionReport(clinicId: string, month: Date) {
        // Month start/end
        const start = new Date(month.getFullYear(), month.getMonth(), 1);
        const end = new Date(month.getFullYear(), month.getMonth() + 1, 0);

        const logs = await this.prisma.commissionLog.findMany({
            where: {
                clinicId,
                createdAt: {
                    gte: start,
                    lte: end
                }
            },
            include: {
                provider: { select: { fullName: true, id: true } }
            }
        });

        // Aggregation
        const totalGenerated = logs.reduce((acc, curr) => acc + Number(curr.providerAmount), 0);
        const totalPending = logs.filter(l => l.status === 'PENDING').reduce((acc, curr) => acc + Number(curr.providerAmount), 0);
        const totalPaid = logs.filter(l => l.status === 'PAID').reduce((acc, curr) => acc + Number(curr.providerAmount), 0);

        // Group by Provider
        const byProviderMap = new Map();
        logs.forEach(log => {
            if (!byProviderMap.has(log.providerId)) {
                byProviderMap.set(log.providerId, {
                    providerId: log.providerId,
                    providerName: log.provider.fullName,
                    totalAmount: 0,
                    pendingAmount: 0,
                    details: []
                });
            }
            const entry = byProviderMap.get(log.providerId);
            entry.totalAmount += Number(log.providerAmount);
            if (log.status === 'PENDING') entry.pendingAmount += Number(log.providerAmount);
            entry.details.push(log);
        });

        return {
            summary: {
                totalGenerated,
                totalPending,
                totalPaid
            },
            byProvider: Array.from(byProviderMap.values())
        };
    }
}
