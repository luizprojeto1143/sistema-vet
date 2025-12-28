import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UpsellService } from './upsell.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('sales')
@UseGuards(JwtAuthGuard)
export class SalesController {
    constructor(private readonly upsellService: UpsellService) { }

    @Post('suggestions')
    async getSuggestions(@Body() body: { items: string[], species?: string, weight?: number }) {
        return this.upsellService.getSuggestions(body);
    }
}
