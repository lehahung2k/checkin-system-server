import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const role = this.reflector.getAllAndOverride<string[]>('role', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!role) {
      // No roles defined, allow access
      return true;
    }
    try {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      const tokenDecrypt = this.jwtService.verify(token);

      if (!tokenDecrypt.role) {
        // User role not provided, deny access
        return false;
      }

      // Store the userId and role in the request object
      request.userId = tokenDecrypt.userId;
      request.role = tokenDecrypt.role;

      // Check if the user's role is included in the allowed roles
      return role.includes(tokenDecrypt.role);
    } catch (e) {
      return false;
    }
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
