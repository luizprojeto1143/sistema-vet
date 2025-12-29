import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
        if (!requiredPermissions) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const userPermissions = user.permissions || [];

        // Admin Wildcard
        if (userPermissions.includes('*')) return true;

        const hasPermission = requiredPermissions.every(permission => {
            // Check exact match or sub-wildcard (e.g., 'finance.*')
            const [resource, action] = permission.split('.');

            // Allow finance.view if user has finance.*
            if (userPermissions.includes(`${resource}.*`)) return true;

            return userPermissions.includes(permission);
        });

        if (!hasPermission) throw new ForbiddenException('Insufficient Permissions');
        return true;
    }
}
