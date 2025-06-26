import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserRole } from 'src/auth/user-role';
import { ROLES_KEY } from './role';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (!requiredRoles) return true;

      const { user } = context.switchToHttp().getRequest<Request>();
      if (!user) throw new UnauthorizedException('Please login');
      if (!requiredRoles.includes(user?.role)) {
        throw new UnauthorizedException('You dont have rights to do that');
      }
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
    return true;
  }
}
