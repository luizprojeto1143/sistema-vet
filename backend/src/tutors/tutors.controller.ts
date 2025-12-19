import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { TutorsService } from './tutors.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('tutors')
@UseGuards(AuthGuard('jwt'))
export class TutorsController {
    constructor(private readonly tutorsService: TutorsService) { }

    @Post()
    create(@Body() data: any) {
        return this.tutorsService.create(data);
    }

    @Get()
    findAll() {
        return this.tutorsService.findAll();
    }

    @Get('me')
    getProfile(@Request() req: any) {
        return this.tutorsService.findByEmail(req.user.email);
    }
}
