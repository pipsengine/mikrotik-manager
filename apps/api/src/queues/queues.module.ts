import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";

@Module({
  imports: [
    BullModule.registerQueue({ name: "backup" }, { name: "discovery" }, { name: "validation" }, { name: "notification" }, { name: "scheduled" })
  ],
  exports: [BullModule]
})
export class QueuesModule {}
