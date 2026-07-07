import { Controller, Get } from "@nestjs/common";

@Controller("telemetry")
export class TelemetryController {
  @Get("health")
  health() {
    return { status: "ok", service: "mikroktic-manager-api" };
  }
}
