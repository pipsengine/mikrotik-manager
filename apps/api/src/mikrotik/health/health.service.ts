import { Injectable } from "@nestjs/common";

@Injectable()
export class HealthService {
  summary() {
    return { online: 0, offline: 0, criticalAlerts: 0, healthScore: 100 };
  }
}
