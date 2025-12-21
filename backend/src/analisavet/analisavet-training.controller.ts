import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { AnalisaVetService } from './analisavet.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('analisavet/training')
@UseGuards(JwtAuthGuard)
export class AnalisaVetTrainingController {
    constructor(private readonly service: AnalisaVetService) { }

    // --- References ---
    @Get('references')
    async getReferences() {
        return this.service.getAllReferences();
    }

    @Post('references')
    async createReference(@Body() data: any) {
        return this.service.createReference(data);
    }

    @Put('references/:id')
    async updateReference(@Param('id') id: string, @Body() data: any) {
        return this.service.updateReference(id, data);
    }

    @Delete('references/:id')
    async deleteReference(@Param('id') id: string) {
        return this.service.deleteReference(id);
    }

    // --- Rules ---
    @Get('rules')
    async getRules() {
        return this.service.getAllRules();
    }

    @Post('rules')
    async createRule(@Body() data: any) {
        return this.service.createRule(data);
    }

    @Put('rules/:id')
    async updateRule(@Param('id') id: string, @Body() data: any) {
        return this.service.updateRule(id, data);
    }

    @Delete('rules/:id')
    async deleteRule(@Param('id') id: string) {
        return this.service.deleteRule(id);
    }
}
