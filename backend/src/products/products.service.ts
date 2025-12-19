import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        return this.prisma.product.create({ data });
    }

    async findAll(clinicId: string) {
        return this.prisma.product.findMany({
            where: { clinicId }
        });
    }

    async update(id: string, data: any) {
        return this.prisma.product.update({
            where: { id },
            data
        });
    }



    async updateStock(id: string, change: number) {
        return this.prisma.product.update({
            where: { id },
            data: { currentStock: { increment: change } }
        });
    }
}
