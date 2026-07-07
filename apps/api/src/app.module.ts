import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { BullModule } from "@nestjs/bullmq";
import { PrismaModule } from "./common/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { AccessControlModule } from "./access-control/access-control.module";
import { MikrotikModule } from "./mikrotik/mikrotik.module";
import { ConfigurationModule } from "./configuration/configuration.module";
import { AiAgentModule } from "./ai-agent/ai-agent.module";
import { ChangeManagementModule } from "./change-management/change-management.module";
import { BackupsModule } from "./backups/backups.module";
import { MonitoringModule } from "./monitoring/monitoring.module";
import { SecurityModule } from "./security/security.module";
import { ReportsModule } from "./reports/reports.module";
import { AuditModule } from "./audit/audit.module";
import { SecretsModule } from "./secrets/secrets.module";
import { JobsModule } from "./jobs/jobs.module";
import { QueuesModule } from "./queues/queues.module";
import { TelemetryModule } from "./telemetry/telemetry.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({ connection: { url: process.env.REDIS_URL ?? "redis://localhost:6379" } }),
    PrismaModule,
    AuthModule,
    AccessControlModule,
    MikrotikModule,
    ConfigurationModule,
    AiAgentModule,
    ChangeManagementModule,
    BackupsModule,
    MonitoringModule,
    SecurityModule,
    ReportsModule,
    AuditModule,
    SecretsModule,
    JobsModule,
    QueuesModule,
    TelemetryModule
  ]
})
export class AppModule {}
