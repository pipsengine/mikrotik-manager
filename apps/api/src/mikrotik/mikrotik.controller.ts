import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
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

  @Get("inventory/onboarding-context")
  @RequirePermissions("routers.view")
  getOnboardingContext() {
    return this.inventory.onboardingContext();
  }

  @Post("inventory")
  @RequirePermissions("routers.create")
  createRouter(@Body() body: { organizationId?: string; siteId?: string; siteName?: string; name: string; host: string; apiPort?: number; restPort?: number; sshPort?: number; model?: string; serialNumber?: string; license?: string; routerOs?: string; status?: string; healthScore?: number; credentialProfile?: string; secretVaultPath?: string; routerUsername?: string; routerPassword?: string; enablePassword?: string; sshUsername?: string; sshPassword?: string }) {
    return this.inventory.create(body);
  }

  @Patch("inventory/:id")
  @RequirePermissions("routers.update")
  updateRouter(@Param("id") id: string, @Body() body: { siteName?: string; name?: string; host?: string; apiPort?: number; restPort?: number; sshPort?: number; model?: string; serialNumber?: string; license?: string; routerOs?: string; status?: string; healthScore?: number }) {
    return this.inventory.update(id, body);
  }

  @Post("inventory/:id/backup")
  @RequirePermissions("backup.create")
  createBackup(@Param("id") id: string) {
    return this.inventory.createBackupSnapshot(id);
  }

  @Post("inventory/:id/actions")
  @RequirePermissions("routers.view")
  recordAction(@Param("id") id: string, @Body() body: { action: string }) {
    return this.inventory.recordInventoryAction(id, body.action || "router.inventory.action");
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

  @Post("detect")
  @RequirePermissions("routers.testConnection")
  detect(@Body() body: { host: string; restPort?: number; routerUsername?: string; routerPassword?: string }) {
    return this.connectionTest.detect(body);
  }

  @Get("health")
  @RequirePermissions("routers.health.view")
  getHealth() {
    return this.health.summary();
  }
}
