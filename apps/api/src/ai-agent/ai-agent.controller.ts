import { Body, Controller, Post } from "@nestjs/common";
import { RequirePermissions } from "../common/permissions.decorator";
import { AiOrchestratorService } from "./ai-orchestrator.service";

@Controller("ai-agent")
export class AiAgentController {
  constructor(private readonly orchestrator: AiOrchestratorService) {}

  @Post("ask")
  @RequirePermissions("ai.ask")
  ask(@Body() body: { prompt: string }) {
    return this.orchestrator.plan(body.prompt);
  }
}
