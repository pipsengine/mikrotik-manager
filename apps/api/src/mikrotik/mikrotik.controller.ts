import { Controller, Get, Post, Body } from "@nestjs/common";
import { RequirePermissions } from "../common/permissions.decorator";
import { DiscoveryService } from "./discovery/discovery.service";
import { ConnectionTestService } from "./connection-test/connection-test.service";
import { InventoryService } from "./inventory/inventory.service";
import { HealthService } from "./health/health.service";

@Controller("mikrotik")
export class MikrotikController {
  constructor(
    private readonly discovery: DiscoveryService,
    private readonly connectionTest: ConnectionTestService,
    private readonly inventory: InventoryService,
    private readonly health: HealthService
  ) {}

  @Get("inventory")
  @RequirePermissions("routers.view")
  getInventory() {
    return this.inventory.list();
  }

  @Post("discovery")
  @RequirePermissions("routers.discover")
  discover(@Body() body: { subnet: string }) {
    return this.discovery.scan(body.subnet);
  }

  @Post("connection-test")
  @RequirePermissions("routers.testConnection")
  test(@Body() body: { host: string }) {
    return this.connectionTest.test(body.host);
  }

  @Get("health")
  @RequirePermissions("routers.health.view")
  getHealth() {
    return this.health.summary();
  }
}
