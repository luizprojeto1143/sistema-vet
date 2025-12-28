
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();

        // If user has no 'role' field, DENY. 
        // Assuming user object has 'role' or 'roles'
        // Adjust based on your User entity. 
        // Usually prisma user has `role`.

        if (!user || !user.role) {
            return false;
        }

        return requiredRoles.includes(user.role);
    }
}
