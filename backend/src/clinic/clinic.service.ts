import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClinicService {
    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        return this.prisma.clinic.create({ data });
    }

    async findAll() {
        return this.prisma.clinic.findMany();
    }

    async findOne(id: string) {
        return this.prisma.clinic.findUnique({ where: { id } });
    }

    async update(id: string, data: any) {
        const updateData: any = {};

        if (data.name !== undefined) updateData.name = data.name;
        if (data.address !== undefined) updateData.address = data.address;
        if (data.phone !== undefined) updateData.phone = data.phone;
        if (data.email !== undefined) updateData.email = data.email;
        if (data.logoUrl !== undefined) updateData.logoUrl = data.logoUrl;

        if (data.internmentDailyRate !== undefined) {
            updateData.internmentDailyRate = Number(data.internmentDailyRate);
        }

        if (data.operatingHours !== undefined) {
            // Ensure we store it as a string
            updateData.operatingHours = typeof data.operatingHours === 'string'
                ? data.operatingHours
                : JSON.stringify(data.operatingHours);
        }

        return this.prisma.clinic.update({
            where: { id },
            data: updateData
        });
    }

    // MARKETING / REFERRALS
    async createReward(clinicId: string, data: any) {
        return this.prisma.referralReward.create({
            data: { ...data, clinicId }
        });
    }

    async getRewards(clinicId: string) {
        return this.prisma.referralReward.findMany({
            where: { clinicId, active: true }
        });
    }

    async deleteReward(id: string) {
        return this.prisma.referralReward.update({
            where: { id },
            data: { active: false }
        });
    }
}
