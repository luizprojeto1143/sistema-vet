import { Controller, Get, Request, UseGuards, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// import { AuthGuard } from '@nestjs/passport'; // Optional: Public or Protected? Protected for now.

@Controller('services')
export class ServicesController {
    constructor(private prisma: PrismaService) { }

    @Get()
    async findAll(@Query('clinicId') clinicId: string) {
        return this.prisma.service.findMany({
            where: { clinicId: clinicId || 'clinic-1' }
        });
    }
}
