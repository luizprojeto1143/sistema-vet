import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MedicalRecordsService } from './medical-records.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('medical-records')
@UseGuards(AuthGuard('jwt'))
export class MedicalRecordsController {
    constructor(private readonly recordsService: MedicalRecordsService) { }

    @Post()
    create(@Body() body: any, @Request() req: any) {
        const data = { ...body, vetId: req.user.id };
        return this.recordsService.create(data);
    }

    @Get('appointment/:id')
    findByAppointment(@Param('id') id: string) {
        return this.recordsService.findByAppointment(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() body: any) {
        return this.recordsService.update(id, body);
    }

    @Post(':id/lock')
    lock(@Param('id') id: string) {
        return this.recordsService.lockRecord(id);
    }

    @Post(':id/amend')
    addAmendment(@Param('id') id: string, @Body() body: any, @Request() req: any) {
        return this.recordsService.addAmendment(id, req.user.id, body.content, body.reason);
    }

    @Get(':id/amendments')
    getAmendments(@Param('id') id: string) {
        return this.recordsService.getAmendments(id);
    }
}
