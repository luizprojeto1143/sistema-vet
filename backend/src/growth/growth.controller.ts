import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { GrowthService } from './growth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('growth')
@UseGuards(JwtAuthGuard)
export class GrowthController {
    constructor(private readonly growthService: GrowthService) { }

    @Get('goals')
    async getGoals(@Request() req: any) {
        // Assuming user has clinicId
        // Fallback to clinic-1 for dev if needed, but best to use req.user.clinicId
        const clinicId = req.user.clinicId || 'clinic-1';
        return this.growthService.getStatus(clinicId);
    }
}
