"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { Activity, AlertTriangle, Download, Filter, Loader2, Plus, RefreshCw, Search, ShieldCheck } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { executionGuardrail, findNavigationItem, moduleColors, navigationItems } from "@mikroktic-manager/shared";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";

const trendData = [
  { name: "Mon", cpu: 42, memory: 58, traffic: 72 },
  { name: "Tue", cpu: 48, memory: 61, traffic: 81 },
  { name: "Wed", cpu: 39, memory: 56, traffic: 68 },
  { name: "Thu", cpu: 52, memory: 64, traffic: 88 },
  { name: "Fri", cpu: 46, memory: 59, traffic: 76 },
  { name: "Sat", cpu: 34, memory: 51, traffic: 55 },
  { name: "Sun", cpu: 37, memory: 54, traffic: 61 }
];

const healthData = [
  { name: "Online", value: 184, color: "#16A34A" },
  { name: "Warning", value: 18, color: "#F59E0B" },
  { name: "Critical", value: 4, color: "#DC2626" },
  { name: "Offline", value: 7, color: "#475569" }
];

const rows = [
  ["RTR-LAG-CORE-01", "Online", "CCR2004", "7.15.3", "92", "Backup current"],
  ["RTR-ABJ-EDGE-02", "Warning", "RB4011", "7.14.2", "76", "Pending approval"],
  ["RTR-PHC-BRANCH-03", "Critical", "hEX S", "7.13.5", "41", "Rollback ready"],
  ["RTR-KAN-WIFI-04", "Online", "cAP ax", "7.15.3", "88", "Compliant"]
];

function statusClass(status: string) {
  if (status === "Online") return "bg-emerald-50 text-emerald-700";
  if (status === "Warning") return "bg-amber-50 text-amber-700";
  if (status === "Critical") return "bg-red-50 text-red-700";
  return "bg-slate-100 text-slate-700";
}

export function EnterprisePage({ route }: { route?: string }) {
  const pathname = usePathname();
  const item = findNavigationItem(route ?? pathname) ?? navigationItems[0];
  const moduleColor = moduleColors[item.module];
  const related = useMemo(() => navigationItems.filter((entry) => entry.module === item.module).slice(0, 6), [item.module]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="space-y-2">
          <Breadcrumbs />
          <div>
            <h1 className="text-2xl font-extrabold text-slate-950">{item.title}</h1>
            <p className="max-w-3xl text-sm font-semibold text-slate-600">{item.description}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-extrabold text-slate-700">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-extrabold text-slate-700">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-3 text-sm font-extrabold text-white">
            <Plus className="h-4 w-4" />
            New Request
          </button>
        </div>
      </div>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4" aria-label="Statistics cards">
        {[
          ["Routers Online", "184", "+12%", "#16A34A"],
          ["Critical Alerts", "4", "-3", "#DC2626"],
          ["Pending Changes", "12", "5 approvals", "#F59E0B"],
          ["Security Score", "91", "WCAG AA", moduleColor]
        ].map(([label, value, caption, color]) => (
          <article key={label} className="rounded-lg border border-slate-200 bg-white shadow-enterprise">
            <div className="h-1 rounded-t-lg" style={{ backgroundColor: color }} />
            <div className="p-4">
              <div className="text-sm font-bold text-slate-500">{label}</div>
              <div className="mt-2 text-3xl font-extrabold text-slate-950">{value}</div>
              <div className="mt-1 text-sm font-bold text-slate-600">{caption}</div>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.5fr_1fr]" aria-label="Charts">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-enterprise">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-950">Traffic, CPU and Memory</h2>
            <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-extrabold text-primary">Live telemetry</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Area type="monotone" dataKey="traffic" stroke="#2563EB" fill="#DBEAFE" />
                <Area type="monotone" dataKey="cpu" stroke="#16A34A" fill="#DCFCE7" />
                <Area type="monotone" dataKey="memory" stroke="#F59E0B" fill="#FEF3C7" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-enterprise">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-950">Router Health</h2>
            <ShieldCheck className="h-5 w-5 text-success" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={healthData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={94} paddingAngle={3}>
                  {healthData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-enterprise" aria-label="Filters">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px_auto]">
          <label className="relative flex items-center">
            <Search className="pointer-events-none absolute left-3 h-4 w-4 text-slate-500" />
            <input className="h-10 w-full rounded-md border border-slate-200 bg-subtle pl-9 pr-3 text-sm font-semibold" placeholder="Filter table records" />
          </label>
          <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold">
            <option>All sites</option>
            <option>Lagos</option>
            <option>Abuja</option>
          </select>
          <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold">
            <option>All risks</option>
            <option>Critical</option>
            <option>High</option>
          </select>
          <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-extrabold">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-enterprise" aria-label="Professional table">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h2 className="text-base font-extrabold text-slate-950">Operational Records</h2>
          <span className="text-xs font-extrabold uppercase text-slate-500">Sticky header, sorting, export, pagination ready</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="sticky top-0 bg-subtle text-xs font-extrabold uppercase text-slate-500">
              <tr>
                {["Router", "Status", "Model", "RouterOS", "Health", "Action"].map((header) => (
                  <th key={header} className="px-4 py-3">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row[0]} className="hover:bg-blue-50/50">
                  <td className="px-4 py-3 font-extrabold text-slate-950">{row[0]}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs font-extrabold ${statusClass(row[1])}`}>{row[1]}</span></td>
                  <td className="px-4 py-3 text-slate-700">{row[2]}</td>
                  <td className="px-4 py-3 text-slate-700">{row[3]}</td>
                  <td className="px-4 py-3"><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full" style={{ width: `${row[4]}%`, backgroundColor: moduleColor }} /></div></td>
                  <td className="px-4 py-3"><button className="rounded-md bg-blue-50 px-2 py-1 text-xs font-extrabold text-primary">{row[5]}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-enterprise xl:col-span-2">
          <h2 className="mb-4 text-base font-extrabold text-slate-950">Change Execution Guardrail</h2>
          <div className="grid gap-2 md:grid-cols-3">
            {executionGuardrail.map((step, index) => (
              <div key={step} className="flex items-center gap-2 rounded-md border border-slate-200 bg-subtle px-3 py-2 text-sm font-extrabold text-slate-700">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs" style={{ color: moduleColor }}>{index + 1}</span>
                {step}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-enterprise">
          <h2 className="mb-4 text-base font-extrabold text-slate-950">Expected States</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2 rounded-md bg-subtle px-3 py-2 text-sm font-bold text-slate-700"><Loader2 className="h-4 w-4 text-primary" /> Loading skeletons</div>
            <div className="flex items-center gap-2 rounded-md bg-subtle px-3 py-2 text-sm font-bold text-slate-700"><Activity className="h-4 w-4 text-success" /> Empty state ready</div>
            <div className="flex items-center gap-2 rounded-md bg-subtle px-3 py-2 text-sm font-bold text-slate-700"><AlertTriangle className="h-4 w-4 text-danger" /> Error and confirmation dialogs</div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-enterprise">
        <h2 className="mb-4 text-base font-extrabold text-slate-950">Module Coverage</h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {related.map((entry) => (
            <a key={entry.route} href={entry.route} className="rounded-md border border-slate-200 p-3 text-sm font-bold text-slate-700 hover:border-blue-200 hover:bg-blue-50">
              <div className="font-extrabold text-slate-950">{entry.title}</div>
              <div className="mt-1 text-xs text-slate-500">{entry.permission}</div>
            </a>
          ))}
        </div>
      </section>

      <div className="h-2" />
    </div>
  );
}
