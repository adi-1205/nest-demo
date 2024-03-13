import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRole = this.reflector.getAllAndOverride<Role>('role', [
            context.getHandler(),
        ]);
        console.log('ROLE', requiredRole);
        
        if (!requiredRole) {
            return true;
        }
        const req = context.switchToHttp().getRequest();
        console.log(req.session);
        
        return requiredRole == req.session?.user?.role;
    }
}