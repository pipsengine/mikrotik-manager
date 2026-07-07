import { Injectable } from "@nestjs/common";
import { aiAgents, executionGuardrail } from "@mikroktic-manager/shared";

@Injectable()
export class AiOrchestratorService {
  plan(prompt: string) {
    return {
      prompt,
      agents: aiAgents,
      guardrail: executionGuardrail,
      nextAction: "Generate change request and request approval",
      executionAllowed: false
    };
  }
}
