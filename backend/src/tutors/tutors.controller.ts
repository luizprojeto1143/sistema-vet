import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { TutorsService } from './tutors.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('tutors')
@UseGuards(AuthGuard('jwt'))
export class TutorsController {
    constructor(private readonly tutorsService: TutorsService) { }

    @Post()
    create(@Body() data: any, @Request() req: any) {
        return this.tutorsService.create({
            ...data,
            clinicId: req.user.clinicId
        });
    }

    @Get()
    findAll(@Request() req: any) {
        return this.tutorsService.findAll(req.user.clinicId);
    }

    @Get('search')
    search(@Query('q') q: string, @Request() req: any) {
        return this.tutorsService.search(q, req.user.clinicId);
    }

    @Get('me')
    getProfile(@Request() req: any) {
        return this.tutorsService.findByEmail(req.user.email);
    }
}
