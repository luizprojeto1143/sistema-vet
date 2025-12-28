import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TimelineService } from './timeline.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('timeline')
@UseGuards(JwtAuthGuard)
export class TimelineController {
    constructor(private readonly timelineService: TimelineService) { }

    @Get('pet/:id')
    async getTimeline(@Param('id') id: string) {
        return this.timelineService.getPetTimeline(id);
    }
}
