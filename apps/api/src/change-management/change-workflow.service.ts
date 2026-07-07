import { Injectable } from "@nestjs/common";
import { changeStatuses, executionGuardrail } from "@mikroktic-manager/shared";

@Injectable()
export class ChangeWorkflowService {
  lifecycle() {
    return { statuses: changeStatuses, guardrail: executionGuardrail };
  }

  create(input: { title: string; routerId: string; risk: string }) {
    return { ...input, status: "Draft", approvalRequired: true, executionAllowed: false };
  }
}
