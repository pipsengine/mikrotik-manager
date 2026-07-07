import { Injectable } from "@nestjs/common";

@Injectable()
export class DiscoveryService {
  scan(subnet: string) {
    return { subnet, discovered: [], queued: true };
  }
}
