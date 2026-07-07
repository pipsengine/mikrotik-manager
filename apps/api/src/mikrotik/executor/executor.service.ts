import { Injectable } from "@nestjs/common";
import { assertApprovedForExecution } from "@mikroktic-manager/security-kit";
import { RouterOsClient } from "../clients/routeros.client";

@Injectable()
export class ExecutorService {
  constructor(private readonly client: RouterOsClient) {}

  execute(change: { routerId: string; status: string; commands: string[] }) {
    assertApprovedForExecution(change.status);
    return this.client.executeApprovedCommands(change.routerId, change.commands);
  }
}
