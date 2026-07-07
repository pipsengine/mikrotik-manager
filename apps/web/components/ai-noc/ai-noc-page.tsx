"use client";

import { usePathname } from "next/navigation";
import { Activity, AlertTriangle, BrainCircuit, CheckCircle2, GitCompare, Network, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { findNavigationItem, moduleColors } from "@mikroktic-manager/shared";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";

const availability = [
  { name: "Mon", availability: 99.94, performance: 91, security: 88, ai: 86 },
  { name: "Tue", availability: 99.96, performance: 92, security: 89, ai: 88 },
  { name: "Wed", availability: 99.91, performance: 89, security: 90, ai: 87 },
  { name: "Thu", availability: 99.98, performance: 94, security: 91, ai: 90 },
  { name: "Fri", availability: 99.95, performance: 93, security: 92, ai: 91 },
  { name: "Sat", availability: 99.99, performance: 95, security: 93, ai: 92 }
];

const incidents = [
  { type: "WAN saturation risk", score: 82 },
  { type: "DHCP pool exhaustion", score: 71 },
  { type: "Certificate expiry", score: 63 },
  { type: "Backup failure risk", score: 48 }
];

const widgets = [
  ["Network Availability", "99.96%", "Executive KPI", "#2563EB", CheckCircle2],
  ["Security Score", "92", "Compliance aligned", "#16A34A", ShieldCheck],
  ["Performance Score", "93", "Healthy", "#06B6D4", Activity],
  ["AI Confidence", "91%", "Context aware", "#7C3AED", BrainCircuit],
  ["Pending Changes", "12", "Approval first", "#F59E0B", AlertTriangle],
  ["Config Drift", "7", "Needs review", "#EA580C", GitCompare],
  ["Predicted Risks", "4", "Forecasting", "#DC2626", TrendingUp],
  ["AI Recommendations", "18", "Approval required", "#475569", Sparkles]
] as const;

export function AiNocPage({ route }: { route?: string }) {
  const pathname = usePathname();
  const item = findNavigationItem(route ?? pathname);
  const title = item?.title ?? "AI-NOC Dashboard";
  const accent = moduleColors["ai-noc"];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="space-y-2">
          <Breadcrumbs />
          <div>
            <h1 className="text-2xl font-extrabold text-slate-950">{title}</h1>
            <p className="max-w-4xl text-sm font-semibold text-slate-600">
              AI-first network operations for monitoring, security, automation, compliance, predictive analytics, digital twin topology, approval workflows and future multi-vendor expansion.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-extrabold text-slate-700">Run Analysis</button>
          <button className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-extrabold text-slate-700">Simulation</button>
          <button className="h-10 rounded-md bg-primary px-3 text-sm font-extrabold text-white">Create Approval</button>
        </div>
      </div>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {widgets.map(([label, value, caption, color, Icon]) => (
          <article key={label} className="rounded-lg border border-slate-200 bg-white shadow-enterprise">
            <div className="h-1 rounded-t-lg" style={{ backgroundColor: color }} />
            <div className="flex items-start justify-between p-4">
              <div>
                <div className="text-sm font-bold text-slate-500">{label}</div>
                <div className="mt-2 text-3xl font-extrabold text-slate-950">{value}</div>
                <div className="mt-1 text-xs font-extrabold uppercase text-slate-500">{caption}</div>
              </div>
              <span className="rounded-md bg-slate-50 p-2" style={{ color }}>
                <Icon className="h-5 w-5" />
              </span>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-enterprise">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-950">AI-NOC Health Trends</h2>
            <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-extrabold text-primary">Live + predictive</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={availability}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Area type="monotone" dataKey="performance" stroke="#2563EB" fill="#DBEAFE" />
                <Area type="monotone" dataKey="security" stroke="#16A34A" fill="#DCFCE7" />
                <Area type="monotone" dataKey="ai" stroke="#7C3AED" fill="#EDE9FE" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-enterprise">
          <h2 className="mb-4 text-base font-extrabold text-slate-950">Predictive Risk Forecast</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incidents}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="type" stroke="#64748B" hide />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Bar dataKey="score" fill={accent} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-enterprise">
          <h2 className="mb-3 text-base font-extrabold text-slate-950">Digital Twin Layers</h2>
          {["Internet", "ISP", "Firewall", "Router", "Switches", "Access Points", "Servers", "Clients", "Printers", "CCTV", "VoIP", "IoT", "Unknown Devices"].map((layer) => (
            <div key={layer} className="mb-2 flex items-center gap-2 rounded-md bg-subtle px-3 py-2 text-sm font-bold"><Network className="h-4 w-4 text-primary" /> {layer}</div>
          ))}
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-enterprise">
          <h2 className="mb-3 text-base font-extrabold text-slate-950">Approval Workspace</h2>
          {["Current configuration", "Proposed configuration", "Side-by-side diff", "Risk score", "Impact analysis", "Simulation results", "Rollback plan", "AI rationale", "Reviewer comments"].map((row) => (
            <div key={row} className="mb-2 rounded-md border-l-4 border-blue-600 bg-subtle px-3 py-2 text-sm font-bold text-slate-700">{row}</div>
          ))}
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-enterprise">
          <h2 className="mb-3 text-base font-extrabold text-slate-950">Visibility Sources</h2>
          {["DNS query logs", "RouterOS firewall tracking", "DHCP leases", "ARP tables", "Queue statistics", "NetFlow/IPFIX", "SNMP", "Syslog", "Wireless telemetry", "Optional endpoint agents"].map((source) => (
            <div key={source} className="mb-2 flex items-center justify-between rounded-md bg-subtle px-3 py-2 text-sm font-bold"><span>{source}</span><span className="text-xs text-slate-500">confidence tagged</span></div>
          ))}
        </div>
      </section>
    </div>
  );
}
