import { Controller, Get, Post, Body, Request, UseGuards, Param } from '@nestjs/common';
import { LegalService } from './legal.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('legal')
@UseGuards(JwtAuthGuard)
export class LegalController {
    constructor(private readonly legalService: LegalService) { }

    @Get('templates')
    async getTemplates(@Request() req: any) {
        const clinicId = req.user.clinicId || 'clinic-1';
        return this.legalService.getTemplates(clinicId);
    }

    @Post('templates')
    async createTemplate(@Body() body: any, @Request() req: any) {
        const clinicId = req.user.clinicId || 'clinic-1';
        return this.legalService.createTemplate(clinicId, body);
    }

    @Post('sign')
    async sign(@Body() body: any, @Request() req: any) {
        return this.legalService.signConsent({
            ...body,
            ipAddress: req.ip // Getting IP from request
        });
    }
}
