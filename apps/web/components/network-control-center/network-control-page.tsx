"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { AlertTriangle, CalendarClock, CheckCircle2, Download, Eye, FileDown, Filter, GlobeLock, Lock, MoreHorizontal, PauseCircle, Search, ShieldAlert, ShieldCheck, WifiOff } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { findNavigationItem, moduleColors } from "@mikroktic-manager/shared";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";

const traffic = [
  { time: "08:00", download: 42, upload: 12, social: 16, streaming: 22 },
  { time: "09:00", download: 58, upload: 18, social: 24, streaming: 31 },
  { time: "10:00", download: 73, upload: 21, social: 29, streaming: 36 },
  { time: "11:00", download: 69, upload: 20, social: 18, streaming: 28 },
  { time: "12:00", download: 94, upload: 28, social: 52, streaming: 61 },
  { time: "13:00", download: 66, upload: 16, social: 19, streaming: 24 },
  { time: "14:00", download: 79, upload: 24, social: 25, streaming: 37 }
];

const categoryData = [
  { category: "Business", value: 44 },
  { category: "Social", value: 28 },
  { category: "Streaming", value: 33 },
  { category: "Gaming", value: 9 },
  { category: "Unknown", value: 14 }
];

const devices = [
  { name: "CEO-LAPTOP", user: "Ada Okafor", ip: "192.168.10.24", mac: "7C:10:C9:22:4D:10", site: "HQ", iface: "bridge-lan", vlan: "10", status: "Online", down: "4.2 GB", up: "812 MB", utilization: 42, policy: "Executive access", seen: "Now", risk: "Low" },
  { name: "GUEST-ANDROID-18", user: "Guest", ip: "192.168.40.88", mac: "A4:55:90:11:AC:18", site: "HQ", iface: "wlan-guest", vlan: "40", status: "Limited", down: "9.7 GB", up: "1.3 GB", utilization: 86, policy: "Guest internet", seen: "2 min ago", risk: "High" },
  { name: "FINANCE-PC-07", user: "Finance Ops", ip: "192.168.20.44", mac: "10:7B:44:19:00:AE", site: "Finance", iface: "ether5", vlan: "20", status: "Online", down: "1.8 GB", up: "442 MB", utilization: 31, policy: "Business only", seen: "Now", risk: "Low" },
  { name: "UNKNOWN-DEVICE", user: "Unassigned", ip: "192.168.10.199", mac: "D8:2A:14:77:B9:20", site: "HQ", iface: "bridge-lan", vlan: "10", status: "Quarantine", down: "620 MB", up: "98 MB", utilization: 68, policy: "Quarantine", seen: "8 min ago", risk: "Critical" }
];

const domains = ["youtube.com", "facebook.com", "tiktok.com", "instagram.com", "dropbox.com", "office.com"];

function utilizationColor(value: number) {
  if (value >= 80) return "bg-red-500";
  if (value >= 60) return "bg-amber-500";
  if (value <= 0) return "bg-slate-400";
  return "bg-emerald-500";
}

export function NetworkControlPage({ route }: { route?: string }) {
  const pathname = usePathname();
  const item = findNavigationItem(route ?? pathname);
  const [selected, setSelected] = useState<string[]>(["GUEST-ANDROID-18", "UNKNOWN-DEVICE"]);
  const accent = moduleColors["network-control-center"];
  const title = item?.title ?? "Network Control Center";
  const isDevicePage = route?.includes("device-management") || pathname.includes("device-management");

  const cards = useMemo(
    () => [
      ["Total Bandwidth", "1.84 TB", "Blue", "#2563EB", Download],
      ["Active Devices", "286", "Green", "#16A34A", CheckCircle2],
      ["Blocked Attempts", "1,248", "Red", "#DC2626", ShieldAlert],
      ["Policy Violations", "32", "Amber", "#F59E0B", AlertTriangle],
      ["Special Access", "18", "Purple", "#7C3AED", ShieldCheck],
      ["Social Media Traffic", "214 GB", "Pink", "#DB2777", GlobeLock],
      ["Streaming Traffic", "392 GB", "Orange", "#EA580C", PauseCircle],
      ["Unknown Devices", "7", "Slate", "#475569", WifiOff]
    ],
    []
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="space-y-2">
          <Breadcrumbs />
          <div>
            <h1 className="text-2xl font-extrabold text-slate-950">{title}</h1>
            <p className="max-w-4xl text-sm font-semibold text-slate-600">
              Monitor devices, govern bandwidth, control websites and applications, schedule access, approve high-impact policies, and audit every admin action.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-extrabold text-slate-700"><Filter className="h-4 w-4" /> Filters</button>
          <button className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-extrabold text-slate-700"><FileDown className="h-4 w-4" /> Export</button>
          <button className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-3 text-sm font-extrabold text-white"><ShieldCheck className="h-4 w-4" /> New Policy</button>
        </div>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
        HTTPS visibility note: normal HTTPS traffic is classified using DNS logs, domain lists, address lists, firewall counters, Layer7 where suitable, TLS SNI where available, DHCP/ARP/session data, queues, Hotspot/PPPoE users, and supported external filtering integrations. Deep HTTPS content inspection requires a supported proxy, DNS filtering engine, firewall integration, or endpoint agent.
      </div>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, caption, color, Icon]) => (
          <article key={label as string} className="rounded-lg border border-slate-200 bg-white shadow-enterprise">
            <div className="h-1 rounded-t-lg" style={{ backgroundColor: color as string }} />
            <div className="flex items-start justify-between p-4">
              <div>
                <div className="text-sm font-bold text-slate-500">{label as string}</div>
                <div className="mt-2 text-3xl font-extrabold text-slate-950">{value as string}</div>
                <div className="mt-1 text-xs font-extrabold uppercase text-slate-500">{caption as string}</div>
              </div>
              <span className="rounded-md bg-slate-50 p-2" style={{ color: color as string }}>
                <Icon className="h-5 w-5" />
              </span>
            </div>
          </article>
        ))}
      </section>

      {selected.length ? (
        <section className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
          <div className="text-sm font-extrabold text-primary">{selected.length} devices selected</div>
          <div className="flex flex-wrap gap-2">
            {["Apply Policy", "Set Bandwidth", "Block Internet", "Allow Internet", "Add Special Access", "Remove Special Access", "Schedule Access", "Quarantine", "Export"].map((action) => (
              <button key={action} className="h-9 rounded-md border border-blue-200 bg-white px-3 text-xs font-extrabold text-slate-700">{action}</button>
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-enterprise">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-950">Upload / Download Utilization</h2>
            <span className="rounded-md bg-teal-50 px-2 py-1 text-xs font-extrabold" style={{ color: accent }}>Live view</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={traffic}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="time" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Area type="monotone" dataKey="download" stroke="#2563EB" fill="#DBEAFE" />
                <Area type="monotone" dataKey="upload" stroke="#16A34A" fill="#DCFCE7" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-enterprise">
          <h2 className="mb-4 text-base font-extrabold text-slate-950">Traffic Categories</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="category" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Bar dataKey="value" fill={accent} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-enterprise">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px_180px]">
          <label className="relative flex items-center">
            <Search className="pointer-events-none absolute left-3 h-4 w-4 text-slate-500" />
            <input className="h-10 w-full rounded-md border border-slate-200 bg-subtle pl-9 pr-3 text-sm font-semibold" placeholder="Search device, user, IP, MAC, domain or policy" />
          </label>
          <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold"><option>All departments</option><option>Finance</option><option>Guest</option><option>Executive</option></select>
          <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold"><option>All policies</option><option>Business only</option><option>No social media</option><option>Quarantine</option></select>
          <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold"><option>All statuses</option><option>Online</option><option>Limited</option><option>Quarantine</option><option>Offline</option></select>
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-enterprise">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h2 className="text-base font-extrabold text-slate-950">{isDevicePage ? "Device Management" : "Network Devices and Policy State"}</h2>
          <span className="text-xs font-extrabold uppercase text-slate-500">Bulk actions, row actions, policy badges and live utilization</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] text-left text-sm">
            <thead className="bg-subtle text-xs font-extrabold uppercase text-slate-500">
              <tr>
                {["Select", "Device", "User", "IP Address", "MAC Address", "Site", "Interface", "VLAN", "Status", "Download", "Upload", "Utilization Bar", "Current Policy", "Last Seen", "Risk", "Actions"].map((header) => (
                  <th key={header} className="px-4 py-3">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {devices.map((device) => (
                <tr key={device.name} className="hover:bg-blue-50/40">
                  <td className="px-4 py-3"><input type="checkbox" checked={selected.includes(device.name)} onChange={() => setSelected((current) => current.includes(device.name) ? current.filter((name) => name !== device.name) : [...current, device.name])} /></td>
                  <td className="px-4 py-3 font-extrabold text-slate-950">{device.name}</td>
                  <td className="px-4 py-3">{device.user}</td>
                  <td className="px-4 py-3">{device.ip}</td>
                  <td className="px-4 py-3 font-mono text-xs">{device.mac}</td>
                  <td className="px-4 py-3">{device.site}</td>
                  <td className="px-4 py-3">{device.iface}</td>
                  <td className="px-4 py-3">{device.vlan}</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-extrabold">{device.status}</span></td>
                  <td className="px-4 py-3">{device.down}</td>
                  <td className="px-4 py-3">{device.up}</td>
                  <td className="px-4 py-3"><div className="h-2 w-28 rounded-full bg-slate-100"><div className={`h-2 rounded-full ${utilizationColor(device.utilization)}`} style={{ width: `${device.utilization}%` }} /></div></td>
                  <td className="px-4 py-3"><span className="rounded-md bg-teal-50 px-2 py-1 text-xs font-extrabold text-teal-700">{device.policy}</span></td>
                  <td className="px-4 py-3">{device.seen}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs font-extrabold ${device.risk === "Critical" ? "bg-red-50 text-red-700" : device.risk === "High" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>{device.risk}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {[Eye, Lock, CalendarClock, MoreHorizontal].map((Icon, index) => (
                        <button key={index} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600"><Icon className="h-4 w-4" /></button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-enterprise">
          <h2 className="mb-3 text-base font-extrabold text-slate-950">Top Visited Domains</h2>
          <div className="space-y-2">
            {domains.map((domain, index) => (
              <div key={domain} className="flex items-center justify-between rounded-md bg-subtle px-3 py-2 text-sm font-bold">
                <span>{domain}</span>
                <span className="text-slate-500">{120 - index * 14} hits</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-enterprise">
          <h2 className="mb-3 text-base font-extrabold text-slate-950">Workday Policy Timeline</h2>
          {["08:00-12:00 Limited access", "12:00-12:59 Full access", "13:00-17:00 Limited access", "After 17:00 Admin policy"].map((slot) => (
            <div key={slot} className="mb-2 rounded-md border-l-4 border-teal-600 bg-subtle px-3 py-2 text-sm font-bold text-slate-700">{slot}</div>
          ))}
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-enterprise">
          <h2 className="mb-3 text-base font-extrabold text-slate-950">Approval Guardrails</h2>
          {["Backup before firewall or queue changes", "Approval for high-impact restrictions", "Conflict and duplicate rule detection", "Emergency restore and safe rollback", "No blind AI execution"].map((rule) => (
            <div key={rule} className="mb-2 flex items-center gap-2 rounded-md bg-subtle px-3 py-2 text-sm font-bold"><ShieldCheck className="h-4 w-4 text-emerald-600" /> {rule}</div>
          ))}
        </div>
      </section>
    </div>
  );
}
