import { Injectable } from "@nestjs/common";

@Injectable()
export class AiNocService {
  kpis() {
    return {
      executive: {
        networkAvailability: 99.96,
        internetAvailability: 99.91,
        routerHealth: 94,
        securityScore: 92,
        performanceScore: 93,
        complianceScore: 89,
        aiConfidenceScore: 91,
        configurationHealth: 87,
        backupHealth: 96,
        changeSuccessRate: 98
      },
      operational: {
        onlineRouters: 184,
        offlineRouters: 7,
        highCpuDevices: 6,
        highMemoryDevices: 9,
        wanHealth: "Healthy",
        vpnStatus: "2 degraded",
        firewallEvents: 1248,
        activeAlerts: 9,
        pendingChanges: 12,
        aiRecommendations: 18
      }
    };
  }

  visibility() {
    return {
      sources: ["DNS query logs", "RouterOS firewall and connection tracking", "Address lists", "DHCP leases", "ARP tables", "Queue statistics", "NetFlow/IPFIX", "SNMP", "Syslog", "Wireless telemetry", "Optional endpoint agents", "Optional DNS filtering", "Optional secure web gateway"],
      principle: "Observed activity includes source and confidence indicators and does not overstate HTTPS visibility."
    };
  }

  guardrail() {
    return {
      approvalFirst: true,
      readBeforeWrite: true,
      backupBeforeChange: true,
      validateAfterChange: true,
      rollbackOnFailure: true,
      auditEverything: true
    };
  }
}
