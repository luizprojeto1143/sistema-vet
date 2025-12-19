import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('growth')
@UseGuards(AuthGuard('jwt'))
export class GrowthController {
    constructor(private prisma: PrismaService) { }

    @Get('referral-code')
    async getMyReferralCode(@Request() req: any) {
        // Return user's referral code. If not exists, create one.
        const userId = req.user.id;
        // Check if user is Tutor
        const tutor = await this.prisma.tutor.findUnique({ where: { userId } });

        if (tutor) {
            if (!tutor.referralCode) {
                const code = `T-${tutor.id.slice(0, 4).toUpperCase()}${Math.floor(Math.random() * 1000)}`;
                await this.prisma.tutor.update({ where: { id: tutor.id }, data: { referralCode: code } });
                return { code, url: `https://app.vet.com/invite/${code}` };
            }
            return { code: tutor.referralCode, url: `https://app.vet.com/invite/${tutor.referralCode}` };
        }

        const clinic = await this.prisma.clinic.findUnique({ where: { id: req.user.clinicId } });
        if (clinic) {
            if (!clinic.referralCode) {
                const code = `C-${clinic.id.slice(0, 4).toUpperCase()}${Math.floor(Math.random() * 1000)}`;
                await this.prisma.clinic.update({ where: { id: clinic.id }, data: { referralCode: code } });
                return { code, url: `https://admin.vet.com/invite/${code}` };
            }
            return { code: clinic.referralCode, url: `https://admin.vet.com/invite/${clinic.referralCode}` };
        }

        return { message: 'Not eligible' };
    }

    @Get('stats')
    async getStats(@Request() req: any) {
        // Return how many people they invited
        if (req.user.role === 'ADMIN') {
            const count = await this.prisma.clinic.count({
                where: { referredById: req.user.clinicId }
            });
            return { invitedCount: count, credits: 0 }; // TODO: Fetch credits from Clinic
        } else {
            const tutor = await this.prisma.tutor.findUnique({ where: { userId: req.user.id } });
            if (!tutor) return { invitedCount: 0 };
            const count = await this.prisma.tutor.count({ where: { referredById: tutor.id } });
            return { invitedCount: count };
        }
    }
}
