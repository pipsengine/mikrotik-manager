import { Module } from "@nestjs/common";
import { ChangeManagementController } from "./change-management.controller";
import { ChangeWorkflowService } from "./change-workflow.service";

@Module({ controllers: [ChangeManagementController], providers: [ChangeWorkflowService], exports: [ChangeWorkflowService] })
export class ChangeManagementModule {}
