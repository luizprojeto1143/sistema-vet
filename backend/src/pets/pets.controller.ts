import { Controller, Get, Post, Body, Param, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { PetsService } from './pets.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('pets')
@UseGuards(AuthGuard('jwt'))
export class PetsController {
    constructor(private readonly petsService: PetsService) { }

    @Post()
    create(@Body() data: any, @Req() req: any) {
        if (!req.user || !req.user.clinicId) throw new UnauthorizedException('Clinic ID missing');
        // Force Injection of Clinic ID
        return this.petsService.create({ ...data, clinicId: req.user.clinicId });
    }

    @Get()
    findAll(@Req() req: any) {
        if (!req.user || !req.user.clinicId) throw new UnauthorizedException('Clinic ID missing');
        return this.petsService.findAll(req.user.clinicId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Req() req: any) {
        if (!req.user || !req.user.clinicId) throw new UnauthorizedException('Clinic ID missing');
        return this.petsService.findOne(id, req.user.clinicId);
    }
}
