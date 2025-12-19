import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PetsService {
    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        return this.prisma.pet.create({ data });
    }

    async findAll() {
        return this.prisma.pet.findMany({
            include: { tutor: true }
        });
    }

    async findOne(id: string) {
        return this.prisma.pet.findUnique({
            where: { id },
            include: { tutor: true, medicalRecords: true, vaccines: true }
        });
    }
}
