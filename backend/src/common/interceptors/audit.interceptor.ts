import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
    private readonly logger = new Logger(AuditInterceptor.name);

    constructor(private auditService: AuditService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const method = req.method;

        // Only audit mutation requests
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
            const user = req.user;
            const originalUrl = req.originalUrl;
            // Basic entity extraction logic from URL
            // e.g. /services/123 -> entity: Services, id: 123
            const parts = originalUrl.split('/').filter(Boolean);
            const entity = parts[0] || 'Unknown';
            const entityId = parts.length > 1 ? parts[parts.length - 1] : 'New';

            return next.handle().pipe(
                tap((data) => {
                    // Log after successful execution
                    if (user && user.clinicId) {
                        this.auditService.log({
                            clinicId: user.clinicId,
                            userId: user.userId || user.id,
                            action: method,
                            entity: entity,
                            entityId: entityId === 'New' && data && data.id ? data.id : entityId, // Try to get ID from response if it was a create
                            newValue: ['POST', 'PUT', 'PATCH'].includes(method) ? req.body : null,
                            ipAddress: req.ip,
                            userAgent: req.headers['user-agent'],
                        });
                    }
                }),
            );
        }

        return next.handle();
    }
}
