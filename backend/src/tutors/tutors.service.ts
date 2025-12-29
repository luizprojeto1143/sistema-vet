import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TutorsService {
    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        if (data.address && typeof data.address === 'object') {
            data.address = JSON.stringify(data.address);
        }
        return this.prisma.tutor.create({ data });
    }

    async findAll(clinicId: string) {
        return this.prisma.tutor.findMany({
            where: { clinicId },
            include: { pets: true }
        });
    }

    async findByEmail(email: string) {
        // Safe because Email is Unique globally or we can enforce clinicId if users are scoped
        return this.prisma.tutor.findFirst({
            where: { email },
            include: { pets: true }
        });
    }

    async search(query: string, clinicId?: string) {
        if (!query || query.length < 2) return [];

        return this.prisma.tutor.findMany({
            where: {
                clinicId: clinicId, // Enforce clinic scope if provided
                OR: [
                    // @ts-ignore
                    { fullName: { contains: query, mode: 'insensitive' } },
                    { cpf: { contains: query } },
                    { phone: { contains: query } }
                ]
            },
            include: { pets: true },
            take: 10
        });
    }
}
