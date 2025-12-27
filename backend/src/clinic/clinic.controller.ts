import { Controller, Get, Post, Body, Put, Param } from '@nestjs/common';
import { ClinicService } from './clinic.service';

@Controller('clinics')
export class ClinicController {
    constructor(private readonly clinicService: ClinicService) { }

    @Post()
    create(@Body() data: any) {
        return this.clinicService.create(data);
    }

    @Get()
    findAll() {
        return this.clinicService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.clinicService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() data: any) {
        return this.clinicService.update(id, data);
    }

    // MARKETING
    @Post(':id/rewards')
    createReward(@Param('id') clinicId: string, @Body() data: any) {
        return this.clinicService.createReward(clinicId, data);
    }

    @Get(':id/rewards')
    getRewards(@Param('id') clinicId: string) {
        return this.clinicService.getRewards(clinicId);
    }

    @Put('rewards/:rewardId/archive')
    deleteReward(@Param('rewardId') rewardId: string) {
        return this.clinicService.deleteReward(rewardId);
    }
}
