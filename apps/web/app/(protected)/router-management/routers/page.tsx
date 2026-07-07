import type { Metadata } from "next";
import { RoutersPage, type RouterInventoryPayload } from "@/components/router-management/routers-page";

const apiBaseUrl = process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000/api";

export const metadata: Metadata = {
  title: "Routers",
  description: "Manage MikroTik router inventory, connection status, RouterOS versions and operational ownership."
};

function emptyRouterInventory(): RouterInventoryPayload {
  return {
    stats: {
      totalRouters: 0,
      onlineRouters: 0,
      onlinePercent: 0,
      criticalAlerts: 0,
      backupCoverage: 0,
      routersBelowBackupThreshold: 0,
      routerOsDrift: 0,
      pendingChanges: 0,
      highRiskPendingChanges: 0,
      managedRouters: 0,
      offlineRouters: 0,
      degradedRouters: 0
    },
    systemStatus: {
      label: "No Routers Registered",
      uptimePercent: 0,
      lastCheck: new Date(0).toISOString()
    },
    topologyHealth: { healthy: 0, warning: 0, critical: 0 },
    recommendations: [],
    connectionTests: [],
    routers: []
  };
}

async function getInventory(): Promise<RouterInventoryPayload> {
  try {
    const response = await fetch(`${apiBaseUrl}/mikrotik/inventory`, { cache: "no-store" });
    if (!response.ok) return emptyRouterInventory();
    return response.json() as Promise<RouterInventoryPayload>;
  } catch {
    return emptyRouterInventory();
  }
}

export default async function Page() {
  const inventory = await getInventory();
  return <RoutersPage inventory={inventory} />;
}
