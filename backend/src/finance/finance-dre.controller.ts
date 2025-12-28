import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { FinanceDREService } from './finance-dre.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('finance/dre')
@UseGuards(JwtAuthGuard)
export class FinanceDREController {
    constructor(private readonly dreService: FinanceDREService) { }

    @Get()
    async getReport(@Request() req: any, @Query('start') start: string, @Query('end') end: string) {
        const clinicId = req.user.clinicId;
        const startDate = start ? new Date(start) : new Date(new Date().setDate(1)); // Start of month
        const endDate = end ? new Date(end) : new Date();

        return this.dreService.getDRE(clinicId, startDate, endDate);
    }
}
