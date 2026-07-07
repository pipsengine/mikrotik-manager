import { Controller, Get, Param } from "@nestjs/common";
import { RequirePermissions } from "../common/permissions.decorator";

@Controller("reports")
export class ReportsController {
  @Get(":type")
  @RequirePermissions("reports.view")
  report(@Param("type") type: string) {
    return { type, formats: ["PDF", "Excel", "CSV"], status: "ready" };
  }
}
