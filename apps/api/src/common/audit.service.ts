import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.module";

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  record(input: { userId?: string; routerId?: string; action: string; entity: string; before?: unknown; after?: unknown; ipAddress?: string; device?: string }) {
    return this.prisma.auditLog.create({
      data: {
        userId: input.userId,
        routerId: input.routerId,
        action: input.action,
        entity: input.entity,
        before: input.before ? JSON.stringify(input.before) : undefined,
        after: input.after ? JSON.stringify(input.after) : undefined,
        ipAddress: input.ipAddress,
        device: input.device
      }
    });
  }
}
