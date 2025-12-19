
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { SaasService } from './saas.service';

@Controller('saas')
export class SaasController {
    constructor(private readonly saasService: SaasService) { }

    @Get('dashboard')
    async getDashboardMetrics() {
        return this.saasService.getDashboardMetrics();
    }

    @Get('tenants')
    async getTenants() {
        return this.saasService.getTenants();
    }

    @Get('plans')
    async getPlans() {
        return this.saasService.getPlans();
    }

    // TODO: Add DTOs for safety
    @Post('plans')
    async createPlan(@Body() body: any) {
        return this.saasService.createPlan(body);
    }

    @Get('settings')
    async getSettings() {
        return this.saasService.getSettings();
    }

    @Post('settings')
    async updateSettings(@Body() body: any) {
        return this.saasService.updateSettings(body);
    }

    @Get('growth')
    async getGrowthMetrics() {
        return this.saasService.getGrowthMetrics();
    }
}
