import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SaasService {
    constructor(private prisma: PrismaService) { }

    async getDashboardMetrics() {
        // 1. Calculate MRR (Monthly Recurring Revenue)
        const activeClinics = await this.prisma.clinic.findMany({
            include: { plan: true },
        });

        let mrr = 0;
        let totalActive = 0;

        // Simplistic Calculation: Sum of Fixed Prices
        // TODO: Approximate percentage based revenue
        for (const clinic of activeClinics) {
            if (!clinic.planId) continue; // Skip No Plan
            totalActive++;

            if (clinic.plan.billingType === 'FIXED' && clinic.plan.fixedPrice) {
                mrr += Number(clinic.plan.fixedPrice);
            } else if (clinic.plan.billingType === 'PERCENTAGE') {
                // Estimation: Average Clinic Revenue R$ 20k * Percentage
                mrr += 20000 * ((clinic.plan.percentage || 5) / 100);
            }
        }

        // 2. Churn (Mocked logic for now, or based on 'SUSPENDED' stats)
        const churnRate = 1.2;

        // 3. System Health (Mocked)
        const healthStatus = 'HEALTHY';

        return {
            mrr,
            activeClinics: totalActive,
            churnRate,
            healthStatus,
            totalClinics: activeClinics.length
        };
    }

    async getTenants() {
        return this.prisma.clinic.findMany({
            include: {
                plan: true,
                users: {
                    where: { role: 'ADMIN' },
                    take: 1,
                    select: { fullName: true, email: true, phone: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getPlans() {
        return this.prisma.plan.findMany({
            include: { _count: { select: { clinics: true } } }
        });
    }

    async createPlan(data: any) {
        return this.prisma.plan.create({ data });
    }

    async updatePlan(id: string, data: any) {
        return this.prisma.plan.update({ where: { id }, data });
    }

    async getSettings() {
        // Singleton pattern: ID 'global'
        return this.prisma.saasConfig.upsert({
            where: { id: 'global' },
            update: {},
            create: { id: 'global' }
        });
    }

    async updateSettings(data: any) {
        return this.prisma.saasConfig.update({
            where: { id: 'global' },
            data
        });
    }

    async getGrowthMetrics() {
        // 1. Get Clinics with Referrals
        const referringClinics = await this.prisma.clinic.findMany({
            where: { referrals: { some: {} } },
            include: {
                _count: { select: { referrals: true } },
                referrals: { select: { name: true, createdAt: true } }
            },
            orderBy: { referrals: { _count: 'desc' } },
            take: 10
        });

        return {
            topReferrers: referringClinics.map(c => ({
                id: c.id,
                name: c.name,
                totalReferrals: c._count.referrals,
                creditsEarned: c.saasCredits
            })),
            recentReferrals: [] // mock for now
        };
    }
}
