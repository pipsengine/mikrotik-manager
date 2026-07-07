import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSIONS_KEY } from "./permissions.decorator";
import type { Permission } from "@mikroktic-manager/shared";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
    if (!required?.length) return true;
    const request = context.switchToHttp().getRequest<{ user?: { permissions?: Permission[] } }>();
    const userPermissions = request.user?.permissions ?? [];
    return required.every((permission) => userPermissions.includes(permission));
  }
}
