import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('audit')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditController {
    constructor(private readonly auditService: AuditService) { }

    @Get()
    @Roles('ADMIN', 'MASTER')
    async findAll(@Request() req, @Query('limit') limit: string) {
        return this.auditService.findAll(req.user.clinicId, limit ? parseInt(limit) : 50);
    }
}
