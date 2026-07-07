import { Injectable } from "@nestjs/common";

@Injectable()
export class BackupService {
  createRollbackPoint(routerId: string) {
    return { routerId, rollbackPoint: `rollback-${Date.now()}`, encrypted: true, versioned: true };
  }
}
