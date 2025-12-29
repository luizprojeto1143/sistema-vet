import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MedicalRecordsService } from './medical-records.service';
import { ClinicalSummaryService } from './clinical-summary.service';
import { AuthGuard } from '@nestjs/passport';
import { ImmutableRecordGuard } from '../common/guards/immutable-record.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../common/guards/permissions.guard';

@Controller('medical-records')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class MedicalRecordsController {
    constructor(
        private readonly recordsService: MedicalRecordsService,
        private readonly clinicalSummaryService: ClinicalSummaryService
    ) { }

    @Get('patient-summary/:petId')
    @Permissions('medical-records.view')
    getPatientSummary(@Param('petId') petId: string, @Request() req: any) {
        return this.clinicalSummaryService.getPatientSummary(petId, req.user.clinicId);
    }

    @Post()
    create(@Body() body: any, @Request() req: any) {
        const data = { ...body, vetId: req.user.id };
        return this.recordsService.create(data);
    }

    @Get('appointment/:id')
    findByAppointment(@Param('id') id: string, @Request() req: any) {
        return this.recordsService.findByAppointment(id, req.user.clinicId);
    }

    @Put(':id')
    @UseGuards(ImmutableRecordGuard)
    update(@Param('id') id: string, @Body() body: any, @Request() req: any) {
        return this.recordsService.update(id, body, req.user.clinicId);
    }

    @Post(':id/lock')
    lock(@Param('id') id: string, @Request() req: any) {
        return this.recordsService.lockRecord(id, req.user.clinicId);
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
