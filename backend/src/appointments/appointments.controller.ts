import { Controller, Get, Post, Body, UseGuards, Request, Query, Patch, Param } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('appointments')
@UseGuards(AuthGuard('jwt'))
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) { }

    @Post()
    create(@Body() body: any, @Request() req: any) {
        // Attach clinicId from the logged user
        const data = { ...body, clinicId: req.user.clinicId };
        return this.appointmentsService.create(data);
    }

    @Get()
    findAll(@Query('clinicId') clinicId: string) {
        return this.appointmentsService.findAll(clinicId || 'clinic-1');
    }

    @Get('slots')
    getSlots(
        @Query('clinicId') clinicId: string,
        @Query('date') date: string,
        @Query('vetId') vetId?: string,
        @Query('serviceId') serviceId?: string
    ) {
        return this.appointmentsService.getAvailableSlots(clinicId, date, vetId, serviceId);
    }

    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body('status') status: string) {
        return this.appointmentsService.updateStatus(id, status);
    }
    @Patch(':id/details')
    updateDetails(@Param('id') id: string, @Body() body: any) {
        return this.appointmentsService.update(id, body);
    }
}
