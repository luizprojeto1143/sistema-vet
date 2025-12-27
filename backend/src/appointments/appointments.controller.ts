import { Controller, Get, Post, Body, UseGuards, Request, Query, Patch, Param, HttpException, HttpStatus } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('appointments')
@UseGuards(AuthGuard('jwt'))
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) { }

    @Post()
    async create(@Body() body: any, @Request() req: any) {
        try {
            // Attach clinicId from the logged user
            const data = { ...body, clinicId: req.user.clinicId };
            return await this.appointmentsService.create(data);
        } catch (error: any) {
            console.error("Create Appointment Error:", error);
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Internal Server Error',
                message: error.message || 'Unknown Error',
                stack: error.stack
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get()
    findAll(@Request() req: any) {
        return this.appointmentsService.findAll(req.user.clinicId);
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

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.appointmentsService.findOne(id);
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
