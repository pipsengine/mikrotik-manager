import { Module } from "@nestjs/common";
import { AiAgentController } from "./ai-agent.controller";
import { AiOrchestratorService } from "./ai-orchestrator.service";

@Module({ controllers: [AiAgentController], providers: [AiOrchestratorService], exports: [AiOrchestratorService] })
export class AiAgentModule {}
