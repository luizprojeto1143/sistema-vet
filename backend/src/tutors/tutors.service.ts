import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TutorsService {
    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        return this.prisma.tutor.create({ data });
    }

    async findAll() {
        return this.prisma.tutor.findMany({
            include: { pets: true }
        });
    }

    async findByEmail(email: string) {
        return this.prisma.tutor.findFirst({
            where: { email },
            include: { pets: true }
        });
    }

    async search(query: string) {
        if (!query || query.length < 2) return [];

        return this.prisma.tutor.findMany({
            where: {
                OR: [
                    // @ts-ignore
                    { fullName: { contains: query, mode: 'insensitive' } },
                    { cpf: { contains: query } },
                    { phone: { contains: query } }
                ]
            },
            include: { pets: true },
            take: 10 // Limit results
        });
    }
}
