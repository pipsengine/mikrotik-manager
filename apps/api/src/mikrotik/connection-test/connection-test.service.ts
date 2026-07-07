import { Injectable } from "@nestjs/common";

@Injectable()
export class ConnectionTestService {
  test(host: string) {
    return { host, restApi: "pending", routerOsApi: "pending", ssh: "pending" };
  }
}
