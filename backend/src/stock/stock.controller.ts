import { Controller, Post, Body, UseGuards, Request, Get, Param } from '@nestjs/common';
import { StockService } from './stock.service';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Assuming Auth Guard exists

@Controller('stock')
export class StockController {
    constructor(private readonly stockService: StockService) { }

    // @UseGuards(JwtAuthGuard)
    @Post('kits/consume')
    async consumeKit(@Body() body: { kitId: string; quantity: number; medicalRecordId?: string }, @Request() req: any) {
        // Mock User ID if auth not fully wired in tests
        const userId = req.user?.id || 'mock-user-id';
        const clinicId = req.user?.clinicId || 'mock-clinic-id';

        return this.stockService.consumeKit({
            clinicId,
            kitId: body.kitId,
            quantity: body.quantity,
            userId,
            medicalRecordId: body.medicalRecordId
        });
    }

    @Post('consume')
    async manualConsume(@Body() body: { productId: string; quantity: number; reason: string }, @Request() req: any) {
        return this.stockService.manualConsume({
            clinicId: req.user?.clinicId || 'mock-clinic-id',
            userId: req.user?.id || 'mock-user-id',
            productId: body.productId,
            quantity: body.quantity,
            reason: body.reason
        });
    }

    @Get('products/:id/movements')
    async getMovements(@Param('id') id: string) {
        return this.stockService.getProductMovements(id);
    }

    @Get('products')
    async getProducts(@Request() req: any) {
        // Return simple list for dropdown
        return this.stockService.listProducts(req.user?.clinicId || 'mock-clinic-id');
    }

    @Post('inbound')
    async inbound(@Body() body: any, @Request() req: any) {
        return this.stockService.processInbound({
            clinicId: req.user.clinicId || 'clinic-1',
            userId: req.user.userId,
            ...body
        });
    }
}
