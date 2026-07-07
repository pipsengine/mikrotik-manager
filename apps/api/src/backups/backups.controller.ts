import { Controller, Get, Post } from "@nestjs/common";
import { RequirePermissions } from "../common/permissions.decorator";

@Controller("backups")
export class BackupsController {
  @Get()
  @RequirePermissions("backup.view")
  list() {
    return { automatic: true, manual: true, scheduled: true, encrypted: true, versioned: true, items: [] };
  }

  @Post("schedule")
  @RequirePermissions("backup.schedule")
  schedule() {
    return { scheduled: true, retention: "policy-driven" };
  }
}
