import { Injectable } from "@nestjs/common";
import { routerOsConnectionMethods } from "@mikroktic-manager/shared";

@Injectable()
export class RouterOsClient {
  methods = routerOsConnectionMethods;

  async readConfiguration(routerId: string) {
    return { routerId, configuration: {}, source: "RouterOS REST API" };
  }

  async executeApprovedCommands(routerId: string, commands: string[]) {
    return { routerId, commands, executed: true };
  }
}
