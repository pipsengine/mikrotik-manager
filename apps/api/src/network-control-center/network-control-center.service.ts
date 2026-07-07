import { Injectable } from "@nestjs/common";

@Injectable()
export class NetworkControlCenterService {
  dashboard() {
    return {
      totalBandwidth: "1.84 TB",
      activeDevices: 286,
      offlineDevices: 14,
      blockedAttempts: 1248,
      policyViolations: 32,
      socialMediaUsage: "214 GB",
      streamingUsage: "392 GB",
      unknownDevices: 7,
      specialAccessDevices: 18,
      currentActiveSchedule: "Workday limited access"
    };
  }

  devices() {
    return {
      columns: ["select", "device", "user", "ipAddress", "macAddress", "site", "interface", "vlan", "status", "download", "upload", "utilization", "currentPolicy", "lastSeen", "risk", "actions"],
      bulkActions: ["applyPolicy", "removePolicy", "setBandwidthLimit", "blockInternet", "allowInternet", "moveToGroup", "addSpecialAccess", "removeSpecialAccess", "exportSelected", "quarantineSelected"],
      items: []
    };
  }

  policyGuardrail() {
    return {
      aiExecutionAllowed: false,
      requiredSteps: ["Read current configuration", "Generate proposed policy", "Show affected devices/users", "Show risk level", "Take backup", "Request approval", "Execute after approval", "Validate", "Log result", "Rollback if required"]
    };
  }
}
