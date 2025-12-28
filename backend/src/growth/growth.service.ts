import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GrowthService {
    constructor(private prisma: PrismaService) { }

    async getStatus(clinicId: string) {
        // 1. Get Current Goals
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const goals = await this.prisma.salesGoal.findMany({
            where: {
                clinicId,
                period: { gte: startOfMonth }
            }
        });

        const monthlyGoal = goals.find(g => g.type === 'MONTHLY')?.target || 100000;
        const dailyGoal = goals.find(g => g.type === 'DAILY')?.target || 5000;

        // 2. Calculate Actual Revenue (Month)
        const monthRevenue = await this.prisma.financialTransaction.aggregate({
            _sum: { amount: true },
            where: {
                clinicId,
                type: 'INCOME',
                createdAt: { gte: startOfMonth }
            }
        });

        // 3. Calculate Actual Revenue (Day)
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const dayRevenue = await this.prisma.financialTransaction.aggregate({
            _sum: { amount: true },
            where: {
                clinicId,
                type: 'INCOME',
                createdAt: { gte: startOfDay }
            }
        });

        const currentMonth = Number(monthRevenue._sum.amount || 0);
        const currentDay = Number(dayRevenue._sum.amount || 0);

        return {
            period: 'July 2025', // Should be dynamic
            monthly: {
                target: Number(monthlyGoal),
                current: currentMonth,
                percent: Math.round((currentMonth / Number(monthlyGoal)) * 100)
            },
            daily: {
                target: Number(dailyGoal),
                current: currentDay,
                percent: Math.round((currentDay / Number(dailyGoal)) * 100)
            },
            streak: 3 // Mock streak for now
        };
    }
}
