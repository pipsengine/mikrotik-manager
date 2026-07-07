import { Injectable } from "@nestjs/common";
import { RouterOsClient } from "../clients/routeros.client";

@Injectable()
export class ConfigurationReaderService {
  constructor(private readonly client: RouterOsClient) {}

  read(routerId: string) {
    return this.client.readConfiguration(routerId);
  }
}
