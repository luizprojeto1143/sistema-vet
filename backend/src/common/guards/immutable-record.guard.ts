
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ImmutableRecordGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const recordId = request.params.id; // Assuming route is /records/:id

        // Mock Database Fetch
        // const record = await prisma.medicalRecord.findUnique({ where: { id: recordId } });

        // MOCK: Simulate a record created 25 hours ago
        const recordCreatedAt = new Date(Date.now() - 25 * 60 * 60 * 1000);
        const now = new Date();

        const hoursDiff = Math.abs(now.getTime() - recordCreatedAt.getTime()) / 36e5;

        if (hoursDiff > 24 && user.role !== 'MASTER') {
            throw new ForbiddenException('BLOQUEIO JURÍDICO: Prontuários não podem ser editados após 24 horas. Utilize a função "Adendar" para adicionar novas notas.');
        }

        return true;
    }
}
