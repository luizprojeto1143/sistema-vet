import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PetsService } from './pets.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('pets')
@UseGuards(AuthGuard('jwt'))
export class PetsController {
    constructor(private readonly petsService: PetsService) { }

    @Post()
    create(@Body() data: any) {
        return this.petsService.create(data);
    }

    @Get()
    findAll() {
        return this.petsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.petsService.findOne(id);
    }
}
