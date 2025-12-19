
import { Controller, Get, UseGuards, Query, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';

@Controller('audit')
@UseGuards(AuthGuard('jwt'))
export class AuditController {
    constructor(private prisma: PrismaService) { }

    @Get()
    async getLogs(@Request() req: any, @Query('limit') limit: string) {
        // Enforce Admin or specific permission? For now just auth.
        // Ideally req.user.role === 'ADMIN'

        return this.prisma.auditLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit ? Number(limit) : 50,
            include: { user: { select: { fullName: true, email: true, role: true } } }
        });
    }
}
