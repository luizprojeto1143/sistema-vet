import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TemplatesService {
    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        return this.prisma.consultationTemplate.create({
            data: {
                name: data.name,
                category: data.category,
                species: data.species,
                content: JSON.stringify(data.content),
                shared: data.shared || false,
                ownerId: data.ownerId,
                clinicId: data.clinicId
            }
        });
    }

    async findAll(clinicId: string, userId: string) {
        return this.prisma.consultationTemplate.findMany({
            where: {
                clinicId,
                OR: [
                    { ownerId: userId },
                    { shared: true }
                ]
            },
            orderBy: { name: 'asc' }
        });
    }

    async delete(id: string, userId: string) {
        const tpl = await this.prisma.consultationTemplate.findUnique({ where: { id } });
        if (!tpl) throw new Error('Not found');
        if (tpl.ownerId !== userId) throw new Error('Unauthorized');

        return this.prisma.consultationTemplate.delete({ where: { id } });
    }
}
