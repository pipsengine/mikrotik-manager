import { Injectable } from "@nestjs/common";
import { routerInventorySections } from "@mikroktic-manager/shared";
import * as crypto from "node:crypto";
import { PrismaService } from "../../common/prisma.module";
import { readRouterOsRestIdentity } from "../connection-test/connection-test.service";

type CreateRouterInput = {
  organizationId?: string;
  siteId?: string;
  siteName?: string;
  name: string;
  host: string;
  apiPort?: number;
  restPort?: number;
  sshPort?: number;
  model?: string;
  serialNumber?: string;
  license?: string;
  routerOs?: string;
  status?: string;
  healthScore?: number;
  credentialProfile?: string;
  secretVaultPath?: string;
  routerUsername?: string;
  routerPassword?: string;
  enablePassword?: string;
  sshUsername?: string;
  sshPassword?: string;
};

type UpdateRouterInput = {
  name?: string;
  siteName?: string;
  host?: string;
  apiPort?: number;
  restPort?: number;
  sshPort?: number;
  model?: string;
  serialNumber?: string;
  license?: string;
  routerOs?: string;
  status?: string;
  healthScore?: number;
};

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async onboardingContext() {
    const [organizations, sites, recentRouters, totals] = await Promise.all([
      this.prisma.organization.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true }
      }),
      this.prisma.site.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true, location: true, organizationId: true }
      }),
      this.prisma.router.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          host: true,
          status: true,
          model: true,
          routerOs: true,
          createdAt: true,
          site: { select: { name: true } }
        }
      }),
      this.prisma.router.count()
    ]);

    return {
      organizations,
      sites,
      recentRouters: recentRouters.map((router) => ({
        id: router.id,
        name: router.name,
        host: router.host,
        status: router.status,
        model: router.model,
        routerOs: router.routerOs,
        site: router.site?.name ?? "Unassigned",
        createdAt: router.createdAt
      })),
      totals: {
        routers: totals,
        sites: sites.length,
        organizations: organizations.length
      }
    };
  }

  async list() {
    const [routers, routerCounts, pendingChanges, criticalChanges, recommendations, connectionTests] = await Promise.all([
      this.prisma.router.findMany({
        orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
        include: {
          site: true,
          backups: { orderBy: { createdAt: "desc" }, take: 1 },
          changes: { orderBy: { updatedAt: "desc" }, take: 5 },
          metrics: { orderBy: { createdAt: "desc" }, take: 10 }
        }
      }),
      this.prisma.router.groupBy({
        by: ["status"],
        _count: { _all: true }
      }),
      this.prisma.changeRequest.count({
        where: { status: { in: ["Draft", "Pending Approval", "Pending", "Approved"] } }
      }),
      this.prisma.changeRequest.count({
        where: {
          risk: { in: ["High", "Critical"] },
          status: { in: ["Draft", "Pending Approval", "Pending", "Approved"] }
        }
      }),
      this.prisma.aiRecommendation.findMany({
        where: { status: { not: "Dismissed" } },
        orderBy: [{ risk: "desc" }, { createdAt: "desc" }],
        take: 3
      }),
      this.prisma.auditLog.findMany({
        where: { action: { contains: "connection" } },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { router: true }
      })
    ]);

    const counts = routerCounts.reduce<Record<string, number>>((acc, item) => {
      acc[item.status] = item._count._all;
      return acc;
    }, {});

    const totalRouters = routers.length;
    const onlineRouters = counts.Online ?? 0;
    const offlineRouters = counts.Offline ?? 0;
    const degradedRouters = counts.Degraded ?? counts.Warning ?? 0;
    const criticalRouters = routers.filter((router) => router.status === "Critical" || (router.status !== "Unknown" && router.healthScore > 0 && router.healthScore < 50)).length;
    const backedUpRouters = routers.filter((router) => router.backups.length > 0).length;
    const lowBackupRouters = routers.filter((router) => router.backups.length === 0).length;
    const outdatedRouters = routers.filter((router) => isOutdatedRouterOs(router.routerOs)).length;
    const managedRouters = routers.filter((router) => router.status !== "Unknown").length;

    return {
      sections: routerInventorySections,
      stats: {
        totalRouters,
        onlineRouters,
        onlinePercent: totalRouters ? Math.round((onlineRouters / totalRouters) * 100) : 0,
        criticalAlerts: criticalRouters,
        backupCoverage: totalRouters ? Number(((backedUpRouters / totalRouters) * 100).toFixed(1)) : 0,
        routersBelowBackupThreshold: lowBackupRouters,
        routerOsDrift: outdatedRouters,
        pendingChanges,
        highRiskPendingChanges: criticalChanges,
        managedRouters,
        offlineRouters,
        degradedRouters
      },
      systemStatus: {
        label: criticalRouters > 0 || offlineRouters > 0 ? "Attention Required" : "All Systems Operational",
        uptimePercent: totalRouters ? Number((((totalRouters - offlineRouters) / totalRouters) * 100).toFixed(1)) : 0,
        lastCheck: new Date().toISOString()
      },
      topologyHealth: {
        healthy: routers.filter((router) => router.healthScore >= 80).length,
        warning: routers.filter((router) => router.status === "Unknown" || router.status === "Detected" || (router.healthScore >= 50 && router.healthScore < 80)).length,
        critical: routers.filter((router) => router.status === "Critical" || (router.status !== "Unknown" && router.healthScore > 0 && router.healthScore < 50)).length
      },
      recommendations: recommendations.map((item) => ({
        id: item.id,
        title: item.title,
        detail: item.rationale,
        risk: item.risk,
        confidence: item.confidence,
        createdAt: item.createdAt
      })),
      connectionTests: connectionTests.map((item) => ({
        id: item.id,
        routerName: item.router?.name ?? "Unknown router",
        result: item.after ?? item.action,
        createdAt: item.createdAt,
        success: !/fail|timeout|error/i.test(`${item.after ?? item.action}`)
      })),
      routers: routers.map((router) => ({
        id: router.id,
        name: router.name,
        description: router.serialNumber ?? router.license ?? "",
        site: router.site?.name ?? "Unassigned",
        siteId: router.siteId,
        status: router.status,
        model: router.model ?? "Unknown",
        routerOs: router.routerOs ?? "Unknown",
        ip: router.host,
        apiPort: router.apiPort,
        restPort: router.restPort,
        sshPort: router.sshPort,
        lastSeen: router.updatedAt,
        risk: riskFromRouter(router.healthScore, router.status),
        healthScore: router.healthScore,
        backup: router.backups.length ? 100 : 0,
        latestBackup: router.backups[0]?.createdAt ?? null,
        pendingChanges: router.changes.filter((change) => ["Draft", "Pending Approval", "Pending", "Approved"].includes(change.status)).length,
        metrics: router.metrics.map((metric) => ({
          name: metric.name,
          value: metric.value,
          unit: metric.unit,
          createdAt: metric.createdAt
        }))
      }))
    };
  }

  async create(input: CreateRouterInput) {
    const organizationId = input.organizationId ?? (await this.ensureDefaultOrganization());
    const siteId = input.siteId || (input.siteName ? await this.ensureSite(input.siteName, organizationId) : undefined);
    const discovered = await readRouterOsRestIdentity({
      host: input.host,
      restPort: input.restPort,
      routerUsername: input.routerUsername,
      routerPassword: input.routerPassword
    }).catch(() => undefined);
    const enrichedStatus = discovered ? "Online" : input.status || "Unknown";
    const enrichedHealthScore = discovered && (!input.healthScore || input.healthScore <= 0) ? 85 : input.healthScore ?? 0;

    return this.prisma.$transaction(async (tx) => {
      const router = await tx.router.create({
        data: {
          organizationId,
          siteId,
          name: input.name,
          host: input.host,
          apiPort: input.apiPort ?? 8728,
          restPort: input.restPort ?? 443,
          sshPort: input.sshPort ?? 22,
          model: input.model || discovered?.model || undefined,
          serialNumber: input.serialNumber || discovered?.serialNumber || undefined,
          license: input.license || undefined,
          routerOs: input.routerOs || discovered?.routerOs || undefined,
          status: enrichedStatus,
          healthScore: enrichedHealthScore
        }
      });

      const secrets = buildRouterSecrets(input).map((secret) => ({
        routerId: router.id,
        name: secret.name,
        cipher: encryptSecret(secret.value),
        keyRef: "env:ENCRYPTION_MASTER_KEY",
      }));

      if (secrets.length) {
        await tx.secret.createMany({ data: secrets });
      }

      return router;
    });
  }

  async update(id: string, input: UpdateRouterInput) {
    const existing = await this.prisma.router.findUnique({
      where: { id },
      select: { id: true, organizationId: true }
    });
    if (!existing) throw new Error("Router not found");

    const siteId = input.siteName ? await this.ensureSite(input.siteName, existing.organizationId) : undefined;
    const updated = await this.prisma.router.update({
      where: { id },
      data: {
        siteId,
        name: input.name || undefined,
        host: input.host || undefined,
        apiPort: input.apiPort,
        restPort: input.restPort,
        sshPort: input.sshPort,
        model: input.model || undefined,
        serialNumber: input.serialNumber || undefined,
        license: input.license || undefined,
        routerOs: input.routerOs || undefined,
        status: input.status || undefined,
        healthScore: input.healthScore
      }
    });

    await this.prisma.auditLog.create({
      data: {
        routerId: id,
        action: "router.inventory.updated",
        entity: "Router",
        after: JSON.stringify({ name: updated.name, host: updated.host, model: updated.model, routerOs: updated.routerOs, status: updated.status })
      }
    });

    return updated;
  }

  async createBackupSnapshot(id: string) {
    const router = await this.prisma.router.findUnique({ where: { id } });
    if (!router) throw new Error("Router not found");

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const checksum = crypto.createHash("sha256").update(`${router.id}:${router.host}:${timestamp}`).digest("hex");
    const backup = await this.prisma.backup.create({
      data: {
        routerId: id,
        type: "Manual inventory snapshot",
        path: `sql://backup_snapshots/${router.id}/${timestamp}`,
        checksum,
        encrypted: true,
        version: router.routerOs || "Unknown"
      }
    });

    await this.prisma.auditLog.create({
      data: {
        routerId: id,
        action: "router.backup.snapshot.created",
        entity: "Backup",
        after: JSON.stringify({ backupId: backup.id, checksum: backup.checksum, version: backup.version })
      }
    });

    return backup;
  }

  async recordInventoryAction(id: string, action: string) {
    const router = await this.prisma.router.findUnique({ where: { id } });
    if (!router) throw new Error("Router not found");

    return this.prisma.auditLog.create({
      data: {
        routerId: id,
        action,
        entity: "Router",
        after: JSON.stringify({ router: router.name, host: router.host, status: router.status })
      }
    });
  }

  private async ensureDefaultOrganization() {
    const existing = await this.prisma.organization.findFirst({ orderBy: { createdAt: "asc" } });
    if (existing) return existing.id;

    const created = await this.prisma.organization.create({ data: { name: "Default Organization" } });
    return created.id;
  }

  private async ensureSite(siteName: string, organizationId: string) {
    const normalized = siteName.trim();
    if (!normalized || normalized === "Unassigned") return undefined;

    const existing = await this.prisma.site.findFirst({
      where: { name: normalized, organizationId },
      select: { id: true }
    });
    if (existing) return existing.id;

    const created = await this.prisma.site.create({
      data: { name: normalized, organizationId }
    });
    return created.id;
  }
}

function buildRouterSecrets(input: CreateRouterInput) {
  const context = {
    profile: input.credentialProfile || "inline-onboarding",
    vaultPath: input.secretVaultPath || null
  };

  return [
    input.routerUsername || input.routerPassword
      ? {
          name: "routeros-api-credentials",
          value: JSON.stringify({
            ...context,
            username: input.routerUsername || "",
            password: input.routerPassword || ""
          })
        }
      : undefined,
    input.enablePassword
      ? {
          name: "routeros-enable-password",
          value: JSON.stringify({
            ...context,
            password: input.enablePassword
          })
        }
      : undefined,
    input.sshUsername || input.sshPassword
      ? {
          name: "ssh-credentials",
          value: JSON.stringify({
            ...context,
            username: input.sshUsername || "",
            password: input.sshPassword || ""
          })
        }
      : undefined
  ].filter((secret): secret is { name: string; value: string } => Boolean(secret));
}

function encryptSecret(value: string) {
  const keyMaterial = process.env.ENCRYPTION_MASTER_KEY || "development-encryption-key";
  const key = crypto.createHash("sha256").update(keyMaterial).digest();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return JSON.stringify({
    alg: "aes-256-gcm",
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    data: encrypted.toString("base64")
  });
}

function isOutdatedRouterOs(version?: string | null) {
  if (!version) return true;
  const match = version.match(/^(\d+)\.(\d+)/);
  if (!match) return true;
  const major = Number(match[1]);
  const minor = Number(match[2]);
  return major < 7 || (major === 7 && minor < 15);
}

function riskFromRouter(healthScore: number, status: string) {
  if (status === "Unknown" || healthScore <= 0) return "Unknown";
  if (status === "Detected") return "Medium";
  if (status === "Critical" || healthScore < 35) return "Critical";
  if (status === "Offline" || healthScore < 60) return "High";
  if (status === "Degraded" || status === "Warning" || healthScore < 80) return "Medium";
  return "Low";
}
