import { Module } from "@nestjs/common";
import { MikrotikController } from "./mikrotik.controller";
import { RouterOsClient } from "./clients/routeros.client";
import { DiscoveryService } from "./discovery/discovery.service";
import { ConnectionTestService } from "./connection-test/connection-test.service";
import { InventoryService } from "./inventory/inventory.service";
import { HealthService } from "./health/health.service";
import { ConfigurationReaderService } from "./configuration-reader/configuration-reader.service";
import { BackupService } from "./backup/backup.service";
import { ExecutorService } from "./executor/executor.service";
import { ValidatorService } from "./validator/validator.service";
import { RollbackService } from "./rollback/rollback.service";
import { CommandPolicyService } from "./command-policy/command-policy.service";

@Module({
  controllers: [MikrotikController],
  providers: [RouterOsClient, DiscoveryService, ConnectionTestService, InventoryService, HealthService, ConfigurationReaderService, BackupService, ExecutorService, ValidatorService, RollbackService, CommandPolicyService],
  exports: [RouterOsClient, DiscoveryService, ConnectionTestService, InventoryService, HealthService, ConfigurationReaderService, BackupService, ExecutorService, ValidatorService, RollbackService, CommandPolicyService]
})
export class MikrotikModule {}
