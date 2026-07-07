import { Controller, Get } from "@nestjs/common";
import { permissions, rolePermissions, roles } from "@mikroktic-manager/shared";

@Controller("access-control")
export class AccessControlController {
  @Get("matrix")
  matrix() {
    return { roles, permissions, rolePermissions };
  }
}
