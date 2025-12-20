
import { Controller, Post, Get, Param, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FiscalService } from './fiscal.service';

@Controller('fiscal')
@UseGuards(AuthGuard('jwt'))
export class FiscalController {
    constructor(private fiscalService: FiscalService) { }

    @Post('emit/:transactionId')
    async emitInvoice(@Param('transactionId') id: string) {
        return this.fiscalService.emitInvoice(id);
    }

    @Get()
    async listInvoices(@Request() req) {
        // Assume user has clinicId
        return this.fiscalService.getInvoices(req.user.clinicId);
    }
}
