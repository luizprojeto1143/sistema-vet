import { Controller, Get, Put, Body, Param, UseGuards, Request, Post } from '@nestjs/common';
import { ClinicConfigService } from './clinic-config.service';
// import { AuthGuard } from '../auth/auth.guard'; // Assuming global or standard guard

@Controller('clinic/config')
export class ClinicConfigController {
    constructor(private configService: ClinicConfigService) { }

    @Get('flags')
    async getFlags(@Request() req: any) {
        // In real app, get clinicId from req.user
        // For dev, assuming the user is attached via ValidatinPipe/Guard logic or passing in headers
        // Just mocking for now:
        const clinicId = req.user?.clinicId;
        if (!clinicId) return { error: 'No clinic context' };

        return this.configService.getFlags(clinicId);
    }

    @Put('identity')
    async updateIdentity(@Request() req: any, @Body() data: any) {
        const clinicId = req.user?.clinicId;
        return this.configService.updateIdentity(clinicId, data);
    }

    @Post('toggle-module')
    async toggleModule(@Request() req: any, @Body() body: { module: string, enabled: boolean }) {
        const clinicId = req.user?.clinicId;
        return this.configService.toggleModule(clinicId, body.module, body.enabled);
    }
}
