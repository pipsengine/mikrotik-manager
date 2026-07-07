import { Module } from "@nestjs/common";
import { AiNocController } from "./ai-noc.controller";
import { AiNocService } from "./ai-noc.service";

@Module({
  controllers: [AiNocController],
  providers: [AiNocService],
  exports: [AiNocService]
})
export class AiNocModule {}
