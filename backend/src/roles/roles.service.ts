import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesService {
    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        return this.prisma.role.create({ data });
    }

    async findAll(clinicId: string) {
        return this.prisma.role.findMany({
            where: { clinicId },
            include: { _count: { select: { users: true } } }
        });
    }

    async findOne(id: string) {
        return this.prisma.role.findUnique({
            where: { id },
            include: { users: true }
        });
    }

    async update(id: string, data: any) {
        return this.prisma.role.update({
            where: { id },
            data
        });
    }

    async remove(id: string) {
        return this.prisma.role.delete({ where: { id } });
    }
}
