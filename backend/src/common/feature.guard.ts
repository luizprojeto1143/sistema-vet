
import { Injectable, CanActivate, ExecutionContext, SetMetadata, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';

export const Feature = (feature: string) => SetMetadata('feature', feature);

@Injectable()
export class FeatureGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private prisma: PrismaService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const feature = this.reflector.get<string>('feature', context.getHandler());
        if (!feature) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !user.clinicId) {
            // If no user or clinic, maybe we shouldn't block? Or block?
            // For safety, users without clinic (Master?) might bypass or be blocked.
            // Let's assume Master bypasses, others block.
            if (user?.role === 'MASTER') return true;
            return false;
        }

        // Check Clinic Config
        // We could cache this or attach to request in AuthGuard
        // For now, fetch.
        const clinic = await this.prisma.clinic.findUnique({
            where: { id: user.clinicId },
            select: {
                hasPetshop: true,
                hasTelemedicine: true,
                hasInternment: true,
                hasAnalisaVet: true
            }
        });

        if (!clinic) throw new ForbiddenException('Clinic not found');

        // Map feature string to column
        const featureMap: Record<string, boolean> = {
            'PET_SHOP': clinic.hasPetshop,
            'TELEMEDICINE': clinic.hasTelemedicine,
            'INTERNMENT': clinic.hasInternment,
            'AI_ANALYSIS': clinic.hasAnalisaVet
        };

        if (!featureMap[feature]) {
            throw new ForbiddenException(`Feature ${feature} is not enabled for this clinic.`);
        }

        return true;
    }
}
