
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../prisma/prisma.service';

// 1. DECORATOR
export const Audit = (action: string) => SetMetadata('audit_action', action);

// 2. INTERCEPTOR
@Injectable()
export class AuditInterceptor implements NestInterceptor {
    constructor(
        private reflector: Reflector,
        private prisma: PrismaService
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const action = this.reflector.get<string>('audit_action', context.getHandler());

        if (!action) {
            return next.handle();
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user; // Assumes AuthGuard runs before and populates user

        return next.handle().pipe(
            tap(async (data) => {
                if (user) {
                    try {
                        const details = JSON.stringify({
                            params: request.params,
                            query: request.query,
                            ip: request.ip,
                            // body: request.body // Be careful with sensitive data (passwords)
                        });

                        await this.prisma.auditLog.create({
                            data: {
                                action,
                                details: details.slice(0, 500), // Limit size
                                userId: user.userId || user.id
                            }
                        });
                    } catch (err) {
                        console.error('Audit Log Error:', err);
                    }
                }
            })
        );
    }
}
