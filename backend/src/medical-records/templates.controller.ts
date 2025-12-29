import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../common/guards/permissions.guard';

@Controller('templates')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class TemplatesController {
    constructor(private readonly templatesService: TemplatesService) { }

    @Post()
    create(@Body() body: any, @Request() req: any) {
        return this.templatesService.create({
            ...body,
            ownerId: req.user.id,
            clinicId: req.user.clinicId
        });
    }

    @Get()
    findAll(@Request() req: any) {
        return this.templatesService.findAll(req.user.clinicId, req.user.id);
    }

    @Delete(':id')
    delete(@Param('id') id: string, @Request() req: any) {
        return this.templatesService.delete(id, req.user.id);
    }
}
