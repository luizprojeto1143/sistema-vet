
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FeatureGuard, Feature } from '../common/feature.guard';

@Controller('telemedicine')
@UseGuards(AuthGuard('jwt'), FeatureGuard)
@Feature('TELEMEDICINE')
export class TelemedicineController {

    @Post('room')
    async createRoom(@Body() body: { appointmentId: string }) {
        // Simple Jitsi implementation
        // Room name = vet-system-{appointmentId}-{random}
        const roomName = `vet-system-${body.appointmentId}-${Math.floor(Math.random() * 1000)}`;
        // Public Jitsi Meet instance
        const url = `https://meet.jit.si/${roomName}`;

        return {
            url,
            roomName,
            provider: 'Jitsi'
        };
    }
}
