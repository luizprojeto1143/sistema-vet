import { Controller, Get, Post, Body, Param, Put, UseGuards, Request } from '@nestjs/common';
import { InternmentService } from './internment.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('internment')
@UseGuards(AuthGuard('jwt'))
export class InternmentController {
    constructor(private readonly internmentService: InternmentService) { }

    @Post('admit')
    async admit(@Body() body: any) {
        // Should get clinicId from user context ideally
        return this.internmentService.admit(body);
    }

    @Put(':id/discharge')
    async discharge(@Param('id') id: string) {
        return this.internmentService.discharge(id);
    }

    @Get('active')
    async getActive(@Request() req: any) {
        // Mock clinicId or extract from JWT
        const clinicId = 'clinic-1';
        return this.internmentService.getActive(clinicId);
    }

    @Get('tutor/active')
    async getActiveForTutor(@Request() req: any) {
        return this.internmentService.getActiveForTutor(req.user.id);
    }

    @Get(':id')
    async getOne(@Param('id') id: string) {
        return this.internmentService.getOne(id);
    }

    @Post('prescribe')
    async prescribe(@Body() body: any) {
        return this.internmentService.prescribe(body);
    }

    @Post('execute-medication')
    async executeMedication(@Body() body: any) {
        return this.internmentService.executeMedication(body);
    }

    @Post('daily-record')
    async addDailyRecord(@Body() body: any) {
        return this.internmentService.addDailyRecord(body);
    }

    @Post('vital-sign')
    async addVitalSign(@Body() body: any) {
        return this.internmentService.addVitalSign(body);
    }
}
