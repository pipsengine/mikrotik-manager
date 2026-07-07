import { Controller, Get } from "@nestjs/common";
import { RequirePermissions } from "../common/permissions.decorator";

@Controller("monitoring")
export class MonitoringController {
  @Get("dashboard")
  @RequirePermissions("monitoring.view")
  dashboard() {
    return { cpu: [], memory: [], storage: [], temperature: [], interfaces: [], bandwidth: [], logs: [], alerts: [], healthScore: 100, availability: 100 };
  }
}
