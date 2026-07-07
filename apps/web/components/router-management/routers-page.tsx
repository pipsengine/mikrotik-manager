"use client";

import {
  AlertTriangle,
  ArrowUp,
  Bookmark,
  Bot,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  CloudUpload,
  Database,
  Edit3,
  Eye,
  FlaskConical,
  GitBranch,
  Hourglass,
  Network,
  RefreshCw,
  Route,
  Search,
  Server,
  Settings,
  Shield,
  SlidersHorizontal,
  UploadCloud,
  Wifi,
  XCircle,
  Zap
} from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";

export type RouterInventoryPayload = {
  stats: {
    totalRouters: number;
    onlineRouters: number;
    onlinePercent: number;
    criticalAlerts: number;
    backupCoverage: number;
    routersBelowBackupThreshold: number;
    routerOsDrift: number;
    pendingChanges: number;
    highRiskPendingChanges: number;
    managedRouters: number;
    offlineRouters: number;
    degradedRouters: number;
  };
  systemStatus: {
    label: string;
    uptimePercent: number;
    lastCheck: string;
  };
  topologyHealth: {
    healthy: number;
    warning: number;
    critical: number;
  };
  recommendations: Array<{
    id: string;
    title: string;
    detail: string;
    risk: string;
    confidence: number;
    createdAt: string;
  }>;
  connectionTests: Array<{
    id: string;
    routerName: string;
    result: string;
    createdAt: string;
    success: boolean;
  }>;
  routers: Array<{
    id: string;
    name: string;
    description: string;
    site: string;
    status: string;
    model: string;
    routerOs: string;
    ip: string;
    apiPort: number;
    restPort: number;
    sshPort: number;
    lastSeen: string;
    risk: string;
    healthScore: number;
    backup: number;
    latestBackup: string | null;
    pendingChanges: number;
  }>;
};

type RoutersPageProps = {
  inventory: RouterInventoryPayload;
};

type RouterRow = RouterInventoryPayload["routers"][number];

const configTabs = ["WAN Setup", "LAN Setup", "IP Addresses", "DHCP Server", "Firewall Rules", "VLANs", "Wireless / SSID", "QoS / Bandwidth", "VPN", "NAT"];
const visibleConfigTabs = configTabs.slice(0, 7);
const moreConfigTabs = configTabs.slice(7);
const statusOptions = ["All", "Online", "Offline", "Degraded", "Warning", "Critical", "Detected", "Unknown"];
const riskOptions = ["All", "Low", "Medium", "High", "Critical", "Unknown"];

function riskClass(risk: string) {
  if (risk === "Critical") return "bg-red-100 text-red-800";
  if (risk === "High") return "bg-red-50 text-red-700";
  if (risk === "Medium") return "bg-amber-50 text-amber-700";
  if (risk === "Unknown") return "bg-slate-100 text-slate-700";
  return "bg-emerald-50 text-emerald-700";
}

function statusClass(status: string) {
  if (status === "Critical" || status === "Offline") return "bg-red-50 text-red-700";
  if (status === "Degraded" || status === "Warning") return "bg-amber-50 text-amber-700";
  if (status === "Online") return "bg-emerald-50 text-emerald-700";
  return "bg-slate-100 text-slate-700";
}

function statusDotClass(status: string) {
  if (status === "Critical" || status === "Offline") return "bg-red-600";
  if (status === "Degraded" || status === "Warning") return "bg-amber-500";
  if (status === "Online") return "bg-emerald-600";
  return "bg-slate-500";
}

function backupClass(backup: number) {
  if (backup < 55) return "bg-red-600";
  if (backup < 80) return "bg-amber-500";
  return "bg-emerald-600";
}

function formatDate(value: string | null) {
  if (!value) return "Never";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function uniqueValues(values: string[]) {
  return ["All", ...Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b))];
}

function tabDescription(tab: string) {
  const descriptions: Record<string, string> = {
    "WAN Setup": "WAN interfaces, uplinks, gateway readiness and provider handoff checks.",
    "LAN Setup": "Bridge, switching, local gateway and internal segmentation controls.",
    "IP Addresses": "Router address inventory, interface binding and duplicate address review.",
    "DHCP Server": "Lease pools, server bindings and address allocation guardrails.",
    "Firewall Rules": "Input, forward and NAT policy posture for selected routers.",
    VLANs: "VLAN membership, trunk access and site segmentation readiness.",
    "Wireless / SSID": "SSID estate, wireless security mode and radio ownership.",
    "QoS / Bandwidth": "Queues, bandwidth policy and shaping status.",
    VPN: "Tunnel readiness, peer review and remote access posture.",
    NAT: "NAT rule coverage and exposed service review."
  };

  return descriptions[tab] ?? "Configuration context for the selected router inventory view.";
}

function actionLabel(action: string) {
  const labels: Record<string, string> = {
    "router.discovery.requested": "Router Discovery",
    "router.configuration.test.requested": "Configuration Test",
    "router.upgrade.review.requested": "Upgrade Review",
    "router.health.check.requested": "Health Check"
  };

  return labels[action] ?? action;
}

export function emptyRouterInventory(): RouterInventoryPayload {
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

export function RoutersPage({ inventory }: RoutersPageProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [siteFilter, setSiteFilter] = useState("All");
  const [modelFilter, setModelFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");
  const [backupFilter, setBackupFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("WAN Setup");
  const [showMoreTabs, setShowMoreTabs] = useState(false);
  const [activePanel, setActivePanel] = useState<"filters" | "savedViews" | "ai" | "details" | "edit" | "backup" | "quickAction" | null>(null);
  const [selectedRouter, setSelectedRouter] = useState<RouterRow | null>(inventory.routers[0] ?? null);
  const [notice, setNotice] = useState("");
  const [isPending, startTransition] = useTransition();

  const stats = [
    { label: "Total Routers", value: inventory.stats.totalRouters.toLocaleString(), icon: Server, caption: "Registered inventory", action: "all" },
    { label: "Online", value: inventory.stats.onlineRouters.toLocaleString(), icon: Wifi, caption: `${inventory.stats.onlinePercent}% of fleet online`, action: "online" },
    { label: "Critical Alerts", value: inventory.stats.criticalAlerts.toLocaleString(), icon: AlertTriangle, caption: `${inventory.stats.degradedRouters + inventory.stats.offlineRouters} degraded/offline`, danger: inventory.stats.criticalAlerts > 0, action: "critical" },
    { label: "Backup Coverage", value: `${inventory.stats.backupCoverage}%`, icon: CloudUpload, caption: `${inventory.stats.routersBelowBackupThreshold} routers below threshold`, action: "backup" },
    { label: "RouterOS Drift", value: inventory.stats.routerOsDrift.toLocaleString(), icon: GitBranch, caption: "Outdated or unknown versions", action: "drift" },
    { label: "Pending Changes", value: inventory.stats.pendingChanges.toLocaleString(), icon: Hourglass, caption: `${inventory.stats.highRiskPendingChanges} high-risk`, action: "changes" }
  ];

  const totalTopology = inventory.topologyHealth.healthy + inventory.topologyHealth.warning + inventory.topologyHealth.critical;
  const healthyPct = totalTopology ? Math.round((inventory.topologyHealth.healthy / totalTopology) * 100) : 0;
  const warningPct = totalTopology ? Math.round((inventory.topologyHealth.warning / totalTopology) * 100) : 0;
  const criticalPct = totalTopology ? Math.max(0, 100 - healthyPct - warningPct) : 0;
  const siteOptions = uniqueValues(inventory.routers.map((router) => router.site));
  const modelOptions = uniqueValues(inventory.routers.map((router) => router.model));
  const filteredRouters = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return inventory.routers.filter((router) => {
      const matchesQuery = !normalizedQuery || [router.name, router.site, router.ip, router.model, router.routerOs, router.status, router.risk].some((value) => value.toLowerCase().includes(normalizedQuery));
      const matchesStatus = statusFilter === "All" || router.status === statusFilter;
      const matchesSite = siteFilter === "All" || router.site === siteFilter;
      const matchesModel = modelFilter === "All" || router.model === modelFilter;
      const matchesRisk = riskFilter === "All" || router.risk === riskFilter;
      const matchesBackup = backupFilter === "All" || (backupFilter === "Missing" && router.backup <= 0) || (backupFilter === "Below 80%" && router.backup < 80);
      return matchesQuery && matchesStatus && matchesSite && matchesModel && matchesRisk && matchesBackup;
    });
  }, [backupFilter, inventory.routers, modelFilter, query, riskFilter, siteFilter, statusFilter]);

  const openPanel = (panel: typeof activePanel, router?: RouterRow) => {
    if (router) setSelectedRouter(router);
    setActivePanel(panel);
    setNotice("");
  };

  const applyStatView = (action: string) => {
    setQuery("");
    setStatusFilter("All");
    setSiteFilter("All");
    setModelFilter("All");
    setRiskFilter("All");
    setBackupFilter("All");
    setActivePanel(null);

    if (action === "online") setStatusFilter("Online");
    if (action === "critical") setRiskFilter("Critical");
    if (action === "backup") setBackupFilter("Below 80%");
    if (action === "drift") setQuery("Unknown");
    if (action === "changes") setNotice("Pending change records are summarized from SQL Server change requests.");
  };

  const applySavedView = (view: "all" | "attention" | "unknown" | "backups") => {
    setQuery("");
    setStatusFilter("All");
    setSiteFilter("All");
    setModelFilter("All");
    setRiskFilter("All");
    setBackupFilter("All");
    if (view === "attention") setRiskFilter("Critical");
    if (view === "unknown") setStatusFilter("Unknown");
    if (view === "backups") setBackupFilter("Missing");
    setActivePanel(null);
  };

  const recordAction = (router: RouterRow, action: string) => {
    setSelectedRouter(router);
    startTransition(async () => {
      const response = await fetch(`/api/mikrotik/inventory/${router.id}/actions`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action })
      });
      setNotice(response.ok ? `${actionLabel(action)} queued for ${router.name}.` : `${actionLabel(action)} could not be queued.`);
      setActivePanel("quickAction");
    });
  };

  const createBackup = (router: RouterRow) => {
    setSelectedRouter(router);
    startTransition(async () => {
      const response = await fetch(`/api/mikrotik/inventory/${router.id}/backup`, { method: "POST" });
      setNotice(response.ok ? `Backup snapshot created for ${router.name}. Refresh to see updated coverage.` : `Backup snapshot could not be created for ${router.name}.`);
      setActivePanel("backup");
    });
  };

  const saveRouter = (formData: FormData) => {
    if (!selectedRouter) return;
    startTransition(async () => {
      const numberOrUndefined = (value: FormDataEntryValue | null) => {
        const raw = String(value ?? "").trim();
        if (!raw) return undefined;
        const parsed = Number(raw);
        return Number.isFinite(parsed) ? parsed : undefined;
      };
      const response = await fetch(`/api/mikrotik/inventory/${selectedRouter.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: String(formData.get("name") ?? "").trim(),
          siteName: String(formData.get("siteName") ?? "").trim(),
          host: String(formData.get("host") ?? "").trim(),
          apiPort: numberOrUndefined(formData.get("apiPort")),
          restPort: numberOrUndefined(formData.get("restPort")),
          sshPort: numberOrUndefined(formData.get("sshPort")),
          model: String(formData.get("model") ?? "").trim(),
          routerOs: String(formData.get("routerOs") ?? "").trim(),
          status: String(formData.get("status") ?? "").trim(),
          healthScore: numberOrUndefined(formData.get("healthScore"))
        })
      });
      setNotice(response.ok ? `Router ${selectedRouter.name} was updated. Refresh to load the latest database values.` : `Router ${selectedRouter.name} could not be updated.`);
    });
  };

  return (
    <div className="min-h-full bg-[#f4f6fa] px-3 py-4 text-slate-950 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-[1440px] space-y-6">
        <header className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-3">
            <Breadcrumbs />
            <div>
              <h1 className="flex items-center gap-3 text-[26px] font-extrabold tracking-normal text-slate-950">
                <Network className="h-7 w-7 text-red-600" />
                mikrotic MANAGER
              </h1>
              <p className="mt-1 max-w-4xl text-sm font-medium text-slate-600">
                Manage MikroTik router inventory, connection status, RouterOS versions and operational ownership.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex h-9 items-center gap-2 rounded-full bg-slate-200/70 px-4 text-sm font-semibold text-slate-800">
              <RefreshCw className="h-4 w-4 text-slate-500" />
              Last DB read: {formatDate(inventory.systemStatus.lastCheck)}
            </span>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6" aria-label="Router statistics">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <button key={stat.label} type="button" onClick={() => applyStatView(stat.action)} className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-[0_2px_8px_rgba(15,23,42,0.03)] transition hover:border-blue-200 hover:bg-blue-50/30 focus:outline-none focus:ring-4 focus:ring-blue-100">
                <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-500">
                  <Icon className="h-4 w-4" />
                  {stat.label}
                </div>
                <div className="mt-1 flex flex-wrap items-baseline gap-2 text-[26px] font-extrabold tracking-normal text-slate-950">
                  {stat.value}
                  {stat.danger ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-extrabold text-red-700">
                      Review
                    </span>
                  ) : null}
                </div>
                {stat.caption ? <p className="mt-1 text-xs font-medium text-slate-500">{stat.caption}</p> : null}
              </button>
            );
          })}
        </section>
        {notice && !activePanel ? (
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-extrabold text-blue-800">{notice}</div>
        ) : null}

        <section className="grid gap-5 xl:grid-cols-[2fr_1fr]">
          <div className="rounded-[18px] bg-slate-950 p-5 text-white shadow-[0_2px_8px_rgba(15,23,42,0.05)]">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <Bot className="h-6 w-6 text-indigo-300" />
              <h2 className="text-lg font-bold">AI Recommendations</h2>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300">Database</span>
            </div>
            {inventory.recommendations.length ? (
              <div className="divide-y divide-slate-800">
                {inventory.recommendations.map((item) => (
                  <div key={item.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      {item.risk === "High" || item.risk === "Critical" ? <Shield className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" /> : <Database className="mt-0.5 h-5 w-5 shrink-0 text-indigo-300" />}
                      <div>
                        <p className="text-sm font-semibold text-slate-100">{item.title}</p>
                        <p className="mt-0.5 line-clamp-2 text-xs font-medium text-slate-400">{item.detail}</p>
                      </div>
                    </div>
                    <span className="h-7 rounded-full bg-slate-800 px-4 py-1 text-xs font-bold text-indigo-200">{Math.round(item.confidence * 100)}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-sm font-semibold text-slate-300">
                No AI recommendations are stored in the database yet.
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-500">
              <Circle className={`h-3 w-3 fill-current ${inventory.stats.criticalAlerts || inventory.stats.offlineRouters ? "text-amber-500" : "text-emerald-600"}`} />
              System Status
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className={`h-3.5 w-3.5 rounded-full ${inventory.stats.criticalAlerts || inventory.stats.offlineRouters ? "bg-amber-500" : "bg-emerald-600"}`} />
              <span className="text-lg font-extrabold text-slate-950">{inventory.systemStatus.label}</span>
              <span className="text-sm font-semibold text-slate-500">{inventory.systemStatus.uptimePercent}% uptime</span>
            </div>
            <div className="mt-4 border-t border-slate-200 pt-3 text-sm font-semibold text-slate-500">
              <RefreshCw className="mr-2 inline h-4 w-4" />
              Last check: {formatDate(inventory.systemStatus.lastCheck)}
            </div>
          </div>
        </section>

        <section className="rounded-[18px] border border-slate-200 bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.03)]" aria-label="Discovery filters">
          <div className="grid gap-3 xl:grid-cols-[minmax(260px,1fr)_auto_auto] xl:items-center">
            <label className="relative flex h-10 items-center rounded-full bg-[#f4f6fa] px-4">
              <Search className="h-4 w-4 text-slate-500" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm font-semibold outline-none placeholder:text-slate-500" placeholder="Search routers by name, site, IP..." />
            </label>
            <div className="flex flex-wrap gap-2">
              <label className="relative">
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-9 appearance-none rounded-full bg-[#f4f6fa] px-4 pr-8 text-sm font-bold text-slate-800 outline-none">
                  {statusOptions.map((status) => <option key={status}>{status}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
              </label>
              <label className="relative">
                <select value={siteFilter} onChange={(event) => setSiteFilter(event.target.value)} className="h-9 appearance-none rounded-full bg-[#f4f6fa] px-4 pr-8 text-sm font-bold text-slate-800 outline-none">
                  {siteOptions.map((site) => <option key={site}>{site}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
              </label>
              <label className="relative">
                <select value={modelFilter} onChange={(event) => setModelFilter(event.target.value)} className="h-9 appearance-none rounded-full bg-[#f4f6fa] px-4 pr-8 text-sm font-bold text-slate-800 outline-none">
                  {modelOptions.map((model) => <option key={model}>{model}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
              </label>
              <label className="relative">
                <select value={riskFilter} onChange={(event) => setRiskFilter(event.target.value)} className="h-9 appearance-none rounded-full bg-[#f4f6fa] px-4 pr-8 text-sm font-bold text-slate-800 outline-none">
                  {riskOptions.map((risk) => <option key={risk}>{risk}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
              </label>
            </div>
            <div className="relative flex flex-wrap gap-2">
              <button type="button" onClick={() => openPanel(activePanel === "filters" ? null : "filters")} className="inline-flex h-9 items-center gap-2 rounded-full bg-[#f4f6fa] px-4 text-sm font-bold text-slate-800">
                <SlidersHorizontal className="h-4 w-4 text-slate-500" />
                Filters
                <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
              </button>
              <button type="button" onClick={() => openPanel(activePanel === "savedViews" ? null : "savedViews")} className="inline-flex h-9 items-center gap-2 rounded-full bg-[#f4f6fa] px-4 text-sm font-bold text-slate-800">
                <Bookmark className="h-4 w-4 text-slate-500" />
                Saved Views
                <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
              </button>
            </div>
          </div>
          {activePanel === "filters" ? (
            <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-slate-50 p-3">
              {["All", "Missing", "Below 80%"].map((option) => (
                <button key={option} type="button" onClick={() => setBackupFilter(option)} className={`h-8 rounded-full px-3 text-xs font-extrabold ${backupFilter === option ? "bg-slate-950 text-white" : "bg-white text-slate-600"}`}>
                  Backups: {option}
                </button>
              ))}
              <button type="button" onClick={() => { setQuery(""); setStatusFilter("All"); setSiteFilter("All"); setModelFilter("All"); setRiskFilter("All"); setBackupFilter("All"); }} className="h-8 rounded-full border border-slate-200 bg-white px-3 text-xs font-extrabold text-slate-700">
                Reset filters
              </button>
            </div>
          ) : null}
          {activePanel === "savedViews" ? (
            <div className="mt-3 grid gap-2 rounded-xl bg-slate-50 p-3 sm:grid-cols-4">
              {[
                ["all", "All routers"],
                ["attention", "Critical risk"],
                ["unknown", "Unknown status"],
                ["backups", "Missing backups"]
              ].map(([key, label]) => (
                <button key={key} type="button" onClick={() => applySavedView(key as "all" | "attention" | "unknown" | "backups")} className="h-9 rounded-lg bg-white px-3 text-left text-sm font-extrabold text-slate-800 hover:bg-slate-100">
                  {label}
                </button>
              ))}
            </div>
          ) : null}
        </section>

        <section className="flex flex-wrap items-center gap-2 rounded-[18px] border border-slate-200 bg-white p-3 shadow-[0_2px_8px_rgba(15,23,42,0.03)]" aria-label="Configuration center shortcuts">
          <span className="mr-2 inline-flex items-center gap-2 px-1 text-sm font-extrabold text-slate-950">
            <Settings className="h-4 w-4" />
            Configuration Center
          </span>
          {visibleConfigTabs.map((tab) => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`h-8 rounded-full px-4 text-sm font-bold ${activeTab === tab ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-[#f4f6fa] hover:text-slate-950"}`}>
              {tab}
            </button>
          ))}
          <span className="relative">
            <button type="button" onClick={() => setShowMoreTabs((value) => !value)} className={`inline-flex h-8 items-center gap-1 rounded-full px-4 text-sm font-bold ${moreConfigTabs.includes(activeTab) ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-[#f4f6fa] hover:text-slate-950"}`}>
            More
            <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {showMoreTabs ? (
              <span className="absolute right-0 top-10 z-20 grid w-48 gap-1 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                {moreConfigTabs.map((tab) => (
                  <button key={tab} type="button" onClick={() => { setActiveTab(tab); setShowMoreTabs(false); }} className="rounded-lg px-3 py-2 text-left text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-950">
                    {tab}
                  </button>
                ))}
              </span>
            ) : null}
          </span>
          <button type="button" onClick={() => openPanel(activePanel === "ai" ? null : "ai")} className="ml-auto inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-950">
            <Bot className="h-4 w-4" />
            AI Network Assistant
          </button>
        </section>

        <section className="rounded-[18px] border border-slate-200 bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.03)]" aria-label="Selected configuration context">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-slate-950">{activeTab}</h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">{tabDescription(activeTab)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => selectedRouter && recordAction(selectedRouter, "router.configuration.test.requested")} disabled={!selectedRouter || isPending} className="inline-flex h-9 items-center gap-2 rounded-lg bg-slate-950 px-3 text-sm font-extrabold text-white disabled:opacity-50">
                <FlaskConical className="h-4 w-4" />
                Test Selected
              </button>
              <button type="button" onClick={() => selectedRouter && createBackup(selectedRouter)} disabled={!selectedRouter || isPending} className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-extrabold text-slate-700 disabled:opacity-50">
                <CloudUpload className="h-4 w-4" />
                Backup Selected
              </button>
            </div>
          </div>
          {activePanel === "ai" ? (
            <div className="mt-3 rounded-xl bg-slate-950 p-4 text-sm font-semibold text-slate-200">
              AI assistant context is set to {activeTab}. It will use the selected router, current filters, backup coverage and RouterOS drift when recommendations are stored.
            </div>
          ) : null}
        </section>

        <section className="overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.02)]" aria-label="Router inventory table">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1040px] border-collapse text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  {["Router", "Site", "Status", "Model", "RouterOS", "IP Address", "Last Seen", "Risk", "Backups", "Actions"].map((header) => (
                    <th key={header} className="whitespace-nowrap px-4 py-3 text-xs font-extrabold uppercase tracking-normal text-slate-500">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRouters.map((router) => (
                  <tr key={router.id} onClick={() => setSelectedRouter(router)} className={`cursor-pointer hover:bg-slate-50 ${selectedRouter?.id === router.id ? "bg-blue-50/50" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="font-extrabold text-slate-950">{router.name}</div>
                      <div className="mt-0.5 text-xs font-medium text-slate-500">{router.description || `API ${router.apiPort} / SSH ${router.sshPort}`}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700">{router.site}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${statusClass(router.status)}`}>
                        <span className={`h-2 w-2 rounded-full ${statusDotClass(router.status)}`} />
                        {router.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700">{router.model}</td>
                    <td className="px-4 py-3 font-semibold text-slate-700">{router.routerOs}</td>
                    <td className="px-4 py-3 font-semibold text-slate-700">{router.ip}</td>
                    <td className="px-4 py-3 font-semibold text-slate-600">{formatDate(router.lastSeen)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${riskClass(router.risk)}`}>{router.risk}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-10 text-xs font-extrabold text-slate-700">{router.backup}%</span>
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-200">
                          <div className={`h-full rounded-full ${backupClass(router.backup)}`} style={{ width: `${router.backup}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={(event) => { event.stopPropagation(); openPanel("details", router); }} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-950" aria-label={`View ${router.name}`}>
                          <Eye className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={(event) => { event.stopPropagation(); openPanel("edit", router); }} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-950" aria-label={`Edit ${router.name}`}>
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={(event) => { event.stopPropagation(); createBackup(router); }} disabled={isPending} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-950 disabled:opacity-50" aria-label={`Backup ${router.name}`}>
                          <UploadCloud className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!filteredRouters.length ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center">
                      <div className="mx-auto max-w-md">
                        <Server className="mx-auto h-10 w-10 text-slate-300" />
                        <h2 className="mt-3 text-base font-extrabold text-slate-950">{inventory.routers.length ? "No routers match the current view" : "No routers in the database"}</h2>
                        <p className="mt-1 text-sm font-semibold text-slate-500">{inventory.routers.length ? "Adjust the filters or reset the saved view." : "Use the Add Router workflow to detect, authenticate and create the first inventory record."}</p>
                      </div>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>

        {activePanel && ["details", "edit", "backup", "quickAction"].includes(activePanel) && selectedRouter ? (
          <section className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]" aria-live="polite">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-950">
                  {activePanel === "edit" ? "Edit Router" : activePanel === "backup" ? "Backup Action" : activePanel === "quickAction" ? "Action Status" : "Router Details"}
                </h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">{selectedRouter.name} - {selectedRouter.ip}</p>
              </div>
              <button type="button" onClick={() => setActivePanel(null)} className="h-8 rounded-lg border border-slate-200 px-3 text-xs font-extrabold text-slate-600 hover:bg-slate-50">
                Close
              </button>
            </div>

            {notice ? <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm font-extrabold text-blue-800">{notice}</div> : null}

            {activePanel === "details" || activePanel === "backup" || activePanel === "quickAction" ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  ["Status", selectedRouter.status],
                  ["Risk", selectedRouter.risk],
                  ["Model", selectedRouter.model],
                  ["RouterOS", selectedRouter.routerOs],
                  ["Site", selectedRouter.site],
                  ["API / REST / SSH", `${selectedRouter.apiPort} / ${selectedRouter.restPort} / ${selectedRouter.sshPort}`],
                  ["Health", `${selectedRouter.healthScore}%`],
                  ["Backup Coverage", `${selectedRouter.backup}%`]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-slate-50 p-3">
                    <div className="text-xs font-extrabold uppercase tracking-normal text-slate-500">{label}</div>
                    <div className="mt-1 text-sm font-extrabold text-slate-950">{value}</div>
                  </div>
                ))}
              </div>
            ) : null}

            {activePanel === "edit" ? (
              <form action={saveRouter} className="mt-4 grid gap-3 lg:grid-cols-4">
                <input name="name" defaultValue={selectedRouter.name} required className="h-10 rounded-lg border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-400" placeholder="Router name" />
                <input name="siteName" defaultValue={selectedRouter.site === "Unassigned" ? "" : selectedRouter.site} className="h-10 rounded-lg border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-400" placeholder="Site" />
                <input name="host" defaultValue={selectedRouter.ip} required className="h-10 rounded-lg border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-400" placeholder="Host / IP" />
                <select name="status" defaultValue={selectedRouter.status} className="h-10 rounded-lg border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-400">
                  {statusOptions.filter((status) => status !== "All").map((status) => <option key={status}>{status}</option>)}
                </select>
                <input name="model" defaultValue={selectedRouter.model === "Unknown" ? "" : selectedRouter.model} className="h-10 rounded-lg border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-400" placeholder="Model" />
                <input name="routerOs" defaultValue={selectedRouter.routerOs === "Unknown" ? "" : selectedRouter.routerOs} className="h-10 rounded-lg border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-400" placeholder="RouterOS" />
                <input name="apiPort" type="number" defaultValue={selectedRouter.apiPort} className="h-10 rounded-lg border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-400" placeholder="API port" />
                <input name="restPort" type="number" defaultValue={selectedRouter.restPort} className="h-10 rounded-lg border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-400" placeholder="REST port" />
                <input name="sshPort" type="number" defaultValue={selectedRouter.sshPort} className="h-10 rounded-lg border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-400" placeholder="SSH port" />
                <input name="healthScore" type="number" min="0" max="100" defaultValue={selectedRouter.healthScore} className="h-10 rounded-lg border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-400" placeholder="Health score" />
                <button disabled={isPending} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-extrabold text-white disabled:opacity-50 lg:col-span-2">
                  <Check className="h-4 w-4" />
                  {isPending ? "Saving..." : "Save Router Changes"}
                </button>
              </form>
            ) : null}
          </section>
        ) : null}

        <section className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-950">
              <Route className="h-4 w-4 text-slate-500" />
              Topology Health
            </h2>
            {[
              ["Healthy", inventory.topologyHealth.healthy, healthyPct],
              ["Warning", inventory.topologyHealth.warning, warningPct],
              ["Critical", inventory.topologyHealth.critical, criticalPct]
            ].map(([label, count, pct]) => (
              <div key={label} className="flex justify-between py-1.5 text-sm">
                <span className="font-semibold text-slate-500">{label}</span>
                <span className="font-bold text-slate-800">
                  <span className="font-extrabold">{count}</span> ({pct}%)
                </span>
              </div>
            ))}
            <div className="mt-4 flex h-1.5 overflow-hidden rounded-full bg-slate-200">
              <span className="bg-emerald-600" style={{ width: `${healthyPct}%` }} />
              <span className="bg-amber-500" style={{ width: `${warningPct}%` }} />
              <span className="bg-red-600" style={{ width: `${criticalPct}%` }} />
            </div>
          </div>

          <div className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-950">
              <RefreshCw className="h-4 w-4 text-slate-500" />
              Recent Connection Tests
            </h2>
            {inventory.connectionTests.length ? (
              <div className="divide-y divide-slate-100">
                {inventory.connectionTests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                    <span className="font-bold text-slate-800">{test.routerName}</span>
                    <span className="flex items-center gap-2 whitespace-nowrap font-semibold text-slate-500">
                      {test.success ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <XCircle className="h-4 w-4 text-red-600" />}
                      <span className={test.success ? "text-emerald-700" : "text-red-700"}>{test.result}</span>
                      {formatDate(test.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-lg bg-slate-50 p-4 text-sm font-semibold text-slate-500">No connection-test audit records are stored yet.</p>
            )}
          </div>

          <div className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-950">
              <Zap className="h-4 w-4 text-slate-500" />
              Quick Actions
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                [Search, "Router Discovery", "router.discovery.requested"],
                [FlaskConical, "Configuration Test", "router.configuration.test.requested"],
                [CloudUpload, "Backup", "backup"],
                [ArrowUp, "Upgrade", "router.upgrade.review.requested"],
                [Check, "Check", "router.health.check.requested"]
              ].map(([Icon, label, action]) => (
                <button
                  key={label as string}
                  type="button"
                  disabled={!selectedRouter || isPending}
                  onClick={() => {
                    if (!selectedRouter) return;
                    if (action === "backup") createBackup(selectedRouter);
                    else recordAction(selectedRouter, action as string);
                  }}
                  className="inline-flex h-9 items-center gap-2 rounded-full bg-[#f4f6fa] px-4 text-sm font-bold text-slate-800 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Icon className="h-4 w-4 text-slate-500" />
                  {label as string}
                </button>
              ))}
            </div>
            <div className="mt-4 border-t border-slate-200 pt-4 text-sm font-semibold text-slate-500">
              <Route className="mr-2 inline h-4 w-4" />
              {inventory.stats.managedRouters} / {inventory.stats.totalRouters} routers managed
            </div>
          </div>
        </section>

        <footer className="border-t border-slate-200 pt-5 text-center text-xs font-semibold text-slate-400">
          MikroTik Manager inventory reads and writes are backed by SQL Server - <span className="inline-block h-2 w-2 rounded-full bg-emerald-600" /> Live
        </footer>
      </div>
    </div>
  );
}
