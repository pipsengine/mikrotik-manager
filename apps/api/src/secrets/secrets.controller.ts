import { Controller, Get } from "@nestjs/common";
import { RequirePermissions } from "../common/permissions.decorator";

@Controller("secrets")
export class SecretsController {
  @Get("vault")
  @RequirePermissions("security.secrets.manage")
  vault() {
    return { encrypted: true, keyManagement: "external-key-reference", secrets: [] };
  }
}
