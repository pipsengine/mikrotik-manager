import { Controller, Get } from "@nestjs/common";
import { RequirePermissions } from "../common/permissions.decorator";

@Controller("audit")
export class AuditController {
  @Get()
  @RequirePermissions("audit.view")
  list() {
    return { logs: [], immutable: true, scope: ["user", "time", "device", "ip", "before", "after", "approval", "execution", "validation", "rollback"] };
  }
}
