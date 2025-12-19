import { Controller, Get, Post, Body, UseGuards, Request, Query, Param, Delete } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { CommissionService } from './commission.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('finance')
@UseGuards(AuthGuard('jwt'))
export class FinanceController {
    constructor(
        private readonly financeService: FinanceService,
        private readonly commissionService: CommissionService
    ) { }

    @Post()
    create(@Body() body: any, @Request() req: any) {
        const data = { ...body, clinicId: req.user.clinicId };
        return this.financeService.create(data);
    }

    // COMMISSION ENGINE
    @Post('commission/simulate')
    async simulateSplit(@Body() body: any, @Request() req: any) {
        // Body: { items: [{ type: 'SERVICE', price: 100, providerId: '...', serviceId: '...' }] }
        return this.commissionService.simulateTransactionSplit(req.user.clinicId, body.items);
    }

    @Get('commission/dashboard')
    async getCommissionDashboard(@Query('month') month: string, @Request() req: any) {
        const date = month ? new Date(month) : new Date();
        return this.commissionService.getCommissionReport(req.user.clinicId, date);
    }

    @Post('pos/preference')
    async createPosPreference(@Body() body: any, @Request() req: any) {
        // Body: { items: [], amount: 150, payerEmail: '...' }
        // We need to fetch clinic details to know the split rate
        const clinicId = req.user.clinicId;
        return this.financeService.createPaymentPreference(clinicId, body);
    }

    @Get()
    findAll(@Query() query: any, @Request() req: any) {
        return this.financeService.findAll(req.user.clinicId, query);
    }

    @Get('dashboard')
    getDashboard(@Query() query: any, @Request() req: any) {
        const clinicId = req.user.clinicId;
        // Parse dates if provided
        const start = query.startDate ? new Date(query.startDate) : undefined;
        const end = query.endDate ? new Date(query.endDate) : undefined;
        return this.financeService.getFinancialDashboard(clinicId, start, end);
    }

    @Get('summary')
    getSummary(@Request() req: any) {
        return this.financeService.getSummary(req.user.clinicId);
    }
    @Get('cashier/status')
    getCashierStatus(@Request() req: any) {
        return this.financeService.getCashierStatus(req.user.clinicId);
    }

    @Post('cashier/open')
    openCashier(@Body() body: any, @Request() req: any) {
        return this.financeService.openCashier(req.user.clinicId, req.user.userId, Number(body.amount));
    }

    @Get('cashier/history')
    getCashierHistory(@Request() req: any) {
        return this.financeService.getCashierHistory(req.user.clinicId);
    }

    @Post('cashier/close')
    closeCashier(@Body() body: any, @Request() req: any) {
        return this.financeService.closeCashier(req.user.clinicId, Number(body.amount));
    }

    @Delete(':id')
    cancelTransaction(@Param('id') id: string, @Request() req: any) {
        return this.financeService.cancelTransaction(id, req.user.id);
    }

    // PROVIDER RULES
    @Post('rules')
    createRule(@Body() body: any, @Request() req: any) {
        return this.financeService.createCommissionRule(req.user.clinicId, body);
    }

    @Get('rules')
    getRules(@Request() req: any) {
        return this.financeService.getCommissionRules(req.user.clinicId);
    }

    @Delete('rules/:id')
    deleteRule(@Param('id') id: string) {
        return this.financeService.deleteCommissionRule(id);
    }
}
