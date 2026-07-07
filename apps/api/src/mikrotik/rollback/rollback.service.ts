import { Injectable } from "@nestjs/common";

@Injectable()
export class RollbackService {
  rollback(routerId: string, rollbackPoint: string) {
    return { routerId, rollbackPoint, queued: true };
  }
}
