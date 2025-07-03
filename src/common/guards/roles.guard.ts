import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';
import { User } from '../../shared/types/user.type'; // Adjust the import path as necessary

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest<{ user: User }>();
    const user = request.user;
    return matchRoles(roles, user.roles || []);
  }
}

function matchRoles(requiredRoles: string[], userRoles: string[]): boolean {
  if (!userRoles) return false;
  return requiredRoles.some((role) => userRoles.includes(role));
}
