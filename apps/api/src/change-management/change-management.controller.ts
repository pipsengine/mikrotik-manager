import { Body, Controller, Get, Post } from "@nestjs/common";
import { RequirePermissions } from "../common/permissions.decorator";
import { ChangeWorkflowService } from "./change-workflow.service";

@Controller("change-management")
export class ChangeManagementController {
  constructor(private readonly workflow: ChangeWorkflowService) {}

  @Get("lifecycle")
  @RequirePermissions("change.view")
  lifecycle() {
    return this.workflow.lifecycle();
  }

  @Post("requests")
  @RequirePermissions("change.create")
  create(@Body() body: { title: string; routerId: string; risk: string }) {
    return this.workflow.create(body);
  }
}
