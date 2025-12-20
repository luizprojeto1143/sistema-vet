import { Controller, Post, Body, UseGuards, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { AnalisaVetService } from './analisavet.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('analisavet')
@UseGuards(AuthGuard('jwt'))
export class AnalisaVetController {
    constructor(private readonly analisavetService: AnalisaVetService) { }

    @Post('analyze')
    analyze(@Body() body: any) {
        return this.analisavetService.analyze(body);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
                ],
                fileIsRequired: true
            }),
        )
        file: Express.Multer.File,
        @Body('medicalRecordId') medicalRecordId?: string
    ) {
        return this.analisavetService.analyzeFile(file, medicalRecordId);
    }
}
