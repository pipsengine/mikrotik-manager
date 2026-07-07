import { Module } from "@nestjs/common";
import { NetworkControlCenterController } from "./network-control-center.controller";
import { NetworkControlCenterService } from "./network-control-center.service";

@Module({
  controllers: [NetworkControlCenterController],
  providers: [NetworkControlCenterService],
  exports: [NetworkControlCenterService]
})
export class NetworkControlCenterModule {}
