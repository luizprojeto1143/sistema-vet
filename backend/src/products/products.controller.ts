import { Controller, Get, Post, Body, UseGuards, Request, Patch, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('products')
@UseGuards(AuthGuard('jwt'))
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    create(@Body() body: any, @Request() req: any) {
        const data = { ...body, clinicId: req.user.clinicId };
        return this.productsService.create(data);
    }

    @Get()
    findAll(@Request() req: any) {
        return this.productsService.findAll(req.user.clinicId);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body: any) {
        return this.productsService.update(id, body);
    }
}
