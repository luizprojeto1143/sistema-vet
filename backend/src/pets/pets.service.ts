import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PetsService {
    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        return this.prisma.pet.create({ data });
    }

    async findAll(clinicId: string) {
        return this.prisma.pet.findMany({
            where: { clinicId },
            include: { tutor: true }
        });
    }

    async findOne(id: string, clinicId: string) {
        const pet = await this.prisma.pet.findFirst({
            where: { id, clinicId },
            include: { tutor: true, medicalRecords: true, vaccines: true }
        });

        if (!pet) throw new NotFoundException('Pet not found or access denied');
        return pet;
    }
}
