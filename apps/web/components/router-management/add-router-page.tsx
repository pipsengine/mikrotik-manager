"use client";

import {
  AlertTriangle,
  ChevronDown,
  CircleDot,
  ClipboardCheck,
  FileSpreadsheet,
  FlaskConical,
  FolderOpen,
  KeyRound,
  LockKeyhole,
  Network,
  Plus,
  Save,
  Search,
  Server,
  ShieldCheck,
  ShieldQuestion,
  Tags,
  TerminalSquare,
  UploadCloud,
  X
} from "lucide-react";
import Image from "next/image";
import { useMemo, useRef, useState, useTransition } from "react";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";

export type AddRouterContext = {
  organizations: Array<{ id: string; name: string }>;
  sites: Array<{ id: string; name: string; location: string | null; organizationId: string }>;
  recentRouters: Array<{
    id: string;
    name: string;
    host: string;
    status: string;
    model: string | null;
    routerOs: string | null;
    site: string;
    createdAt: string;
  }>;
  totals: {
    routers: number;
    sites: number;
    organizations: number;
  };
};

type AddRouterPageProps = {
  context: AddRouterContext;
  createRouterAction: (formData: FormData) => Promise<void>;
};

type DetectResult = {
  host: string;
  reachable: boolean;
  confidence: number;
  likelyMikroTik: boolean;
  ports: Array<{ port: number; service: string; open: boolean; secure?: boolean; banner?: string }>;
  http: Array<{ port: number; protocol: string; reachable: boolean; statusCode?: number; serverHeader?: string }>;
  detected: {
    apiPort: number;
    restPort: number;
    sshPort: number;
    connectionMethod: string;
    status: string;
    signals: string[];
    name?: string;
    model?: string;
    routerOs?: string;
    serialNumber?: string;
  };
  identity?: {
    name?: string;
    model?: string;
    routerOs?: string;
    serialNumber?: string;
    source?: string;
  };
  message: string;
};

const steps = [
  ["01", "Router Identity", "Name, ownership and asset context"],
  ["02", "Management Endpoints", "REST, API and SSH reachability"],
  ["03", "Credentials & Secrets", "Vault-backed authentication"],
  ["04", "Site Assignment", "Topology placement and tags"],
  ["05", "Validation & Baseline", "Readiness before onboarding"]
];

const readiness = [
  ["DNS Reachability", "Not tested", "neutral"],
  ["REST API", "Not tested", "neutral"],
  ["RouterOS API", "Not tested", "neutral"],
  ["SSH", "Not tested", "neutral"],
  ["TLS Certificate", "Warning", "warning"],
  ["Permission Scope", "Not tested", "neutral"],
  ["Backup Baseline", "Not created", "neutral"],
  ["Rollback Point", "Not created", "neutral"]
] as const;

const plannedValidation = [
  "Resolve host and verify DNS record",
  "Open REST API session with TLS policy",
  "Validate RouterOS API permissions",
  "Verify SSH banner and management ACL",
  "Create backup baseline after approval"
];

function readinessClass(state: "neutral" | "warning" | "passed") {
  if (state === "passed") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (state === "warning") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-slate-200 bg-slate-50 text-slate-600";
}

function Field({
  label,
  name,
  placeholder,
  required,
  type = "text",
  helper,
  defaultValue,
  autoComplete
}: {
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
  type?: string;
  helper?: string;
  defaultValue?: string;
  autoComplete?: string;
}) {
  return (
    <label className="space-y-1.5">
      <span className="flex items-center gap-1 text-xs font-extrabold uppercase tracking-normal text-slate-500">
        {label}
        {required ? <span className="text-red-600">*</span> : null}
      </span>
      <input
        name={name}
        required={required}
        type={type}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
      />
      {helper ? <span className="block text-xs font-semibold text-slate-400">{helper}</span> : null}
    </label>
  );
}

function FieldInput({
  label,
  name,
  placeholder,
  required,
  type = "text",
  helper,
  value,
  onChange
}: {
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
  type?: string;
  helper?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-1.5">
      <span className="flex items-center gap-1 text-xs font-extrabold uppercase tracking-normal text-slate-500">
        {label}
        {required ? <span className="text-red-600">*</span> : null}
      </span>
      <input
        name={name}
        required={required}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
      />
      {helper ? <span className="block text-xs font-semibold text-slate-400">{helper}</span> : null}
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
  helper
}: {
  label: string;
  name: string;
  options: string[];
  helper?: string;
}) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs font-extrabold uppercase tracking-normal text-slate-500">{label}</span>
      <span className="relative block">
        <select
          name={name}
          className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
      </span>
      {helper ? <span className="block text-xs font-semibold text-slate-400">{helper}</span> : null}
    </label>
  );
}

function Toggle({ label, name, helper, defaultChecked }: { label: string; name: string; helper?: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 bg-white p-3">
      <span>
        <span className="block text-sm font-extrabold text-slate-900">{label}</span>
        {helper ? <span className="mt-0.5 block text-xs font-semibold text-slate-500">{helper}</span> : null}
      </span>
      <input name={name} type="checkbox" defaultChecked={defaultChecked} className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-200" />
    </label>
  );
}

export function emptyAddRouterContext(): AddRouterContext {
  return {
    organizations: [],
    sites: [],
    recentRouters: [],
    totals: { routers: 0, sites: 0, organizations: 0 }
  };
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

export function AddRouterPage({ context, createRouterAction }: AddRouterPageProps) {
  const siteOptions = ["Unassigned", ...context.sites.map((site) => site.name)];
  const organizationName = context.organizations[0]?.name ?? "Default Organization";
  const formRef = useRef<HTMLFormElement>(null);
  const [routerName, setRouterName] = useState("");
  const [host, setHost] = useState("");
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [routerOs, setRouterOs] = useState("");
  const [apiPort, setApiPort] = useState("8728");
  const [restPort, setRestPort] = useState("443");
  const [sshPort, setSshPort] = useState("22");
  const [connectionMethod, setConnectionMethod] = useState("REST API first");
  const [detectResult, setDetectResult] = useState<DetectResult | null>(null);
  const [detectError, setDetectError] = useState("");
  const [isPending, startTransition] = useTransition();

  const dynamicReadiness = useMemo(() => {
    if (!detectResult) return readiness;
    const open = new Set(detectResult.ports.filter((port) => port.open).map((port) => port.port));
    return [
      ["DNS Reachability", detectResult.reachable ? "Passed" : "Failed", detectResult.reachable ? "passed" : "warning"],
      ["REST API", open.has(443) || open.has(80) ? "Passed" : "Not detected", open.has(443) || open.has(80) ? "passed" : "neutral"],
      ["RouterOS API", open.has(8728) || open.has(8729) ? "Passed" : "Not detected", open.has(8728) || open.has(8729) ? "passed" : "neutral"],
      ["SSH", open.has(22) ? "Passed" : "Not detected", open.has(22) ? "passed" : "neutral"],
      ["TLS Certificate", open.has(443) || open.has(8729) ? "Detected" : "Warning", open.has(443) || open.has(8729) ? "passed" : "warning"],
      ["Permission Scope", "Needs credentials", "neutral"],
      ["Backup Baseline", "Not created", "neutral"],
      ["Rollback Point", "Not created", "neutral"]
    ] as const;
  }, [detectResult]);

  const detectRouter = () => {
    setDetectError("");
    setDetectResult(null);
    const targetHost = host.trim();
    if (!targetHost) {
      setDetectError("Enter an IP address or hostname before running detection.");
      return;
    }

    startTransition(async () => {
      try {
        const formData = formRef.current ? new FormData(formRef.current) : new FormData();
        const response = await fetch("/api/mikrotik/detect", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            host: targetHost,
            restPort: Number(restPort) || undefined,
            apiPort: Number(apiPort) || undefined,
            sshPort: Number(sshPort) || undefined,
            routerUsername: String(formData.get("routerUsername") ?? ""),
            routerPassword: String(formData.get("routerPassword") ?? ""),
            sshUsername: String(formData.get("sshUsername") ?? ""),
            sshPassword: String(formData.get("sshPassword") ?? ""),
            credentialProfile: String(formData.get("credentialProfile") ?? ""),
            secretVaultPath: String(formData.get("secretVaultPath") ?? "")
          })
        });
        if (!response.ok) throw new Error(`Detection failed with status ${response.status}`);
        const result = (await response.json()) as DetectResult;
        setDetectResult(result);
        setApiPort(String(result.detected.apiPort));
        setRestPort(String(result.detected.restPort));
        setSshPort(String(result.detected.sshPort));
        setConnectionMethod(result.detected.connectionMethod);
        const discovered = result.identity ?? result.detected;
        if (!routerName && discovered.name) setRouterName(discovered.name);
        if (!model && discovered.model) setModel(discovered.model);
        if (!serialNumber && discovered.serialNumber) setSerialNumber(discovered.serialNumber);
        if (!routerOs && discovered.routerOs) setRouterOs(discovered.routerOs);
      } catch (error) {
        setDetectError(error instanceof Error ? error.message : "Detection failed.");
      }
    });
  };

  return (
    <div className="min-h-full bg-[#f4f6fa] px-3 py-4 text-slate-950 sm:px-5 lg:px-8">
      <form ref={formRef} action={createRouterAction} className="mx-auto max-w-[1440px] space-y-5 pb-24">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-3">
            <Breadcrumbs />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-16 w-56 items-center rounded-lg border border-slate-200 bg-white px-4 shadow-sm">
                <Image
                  src="/brand/dorman-long-logo-blue-horizontal.jpg"
                  alt="Dorman Long Engineering Limited"
                  width={210}
                  height={70}
                  priority
                  className="h-auto w-full object-contain"
                />
              </div>
              <div>
                <h1 className="flex items-center gap-3 text-[26px] font-extrabold tracking-normal text-slate-950">
                  <Plus className="h-7 w-7 rounded-lg bg-blue-600 p-1.5 text-white" />
                  Add Router
                </h1>
                <p className="mt-1 max-w-4xl text-sm font-semibold text-slate-600">
                  Securely onboard REST API, RouterOS API and SSH-enabled MikroTik routers.
                </p>
                <p className="mt-1 text-xs font-extrabold uppercase tracking-normal text-blue-700">{organizationName}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-extrabold text-slate-700 shadow-sm">
              <FileSpreadsheet className="h-4 w-4" />
              Import CSV
            </button>
            <button type="button" className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-extrabold text-slate-700 shadow-sm">
              <Search className="h-4 w-4" />
              Discover on Subnet
            </button>
          </div>
        </header>

        <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-[0_2px_8px_rgba(15,23,42,0.03)]" aria-label="Onboarding steps">
          <div className="grid gap-2 md:grid-cols-5">
            {steps.map(([number, title, description], index) => (
              <div key={title} className={`rounded-lg border p-3 ${index === 0 ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-slate-50"}`}>
                <div className="flex items-center gap-2">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold ${index === 0 ? "bg-blue-600 text-white" : "bg-white text-slate-500"}`}>{number}</span>
                  <span className="text-sm font-extrabold text-slate-950">{title}</span>
                </div>
                <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <main className="space-y-5">
            <section className="rounded-xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
              <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
                <Server className="h-5 w-5 text-blue-600" />
                <div>
                  <h2 className="text-base font-extrabold text-slate-950">Router Identity</h2>
                  <p className="text-xs font-semibold text-slate-500">Core asset details used across inventory, monitoring and change management.</p>
                </div>
              </div>
              <div className="grid gap-4 p-5 lg:grid-cols-3">
                <FieldInput label="Router Name" name="name" placeholder="RTR-LAG-CORE-01" required value={routerName} onChange={setRouterName} />
                <SelectField label="Site" name="siteName" options={siteOptions} helper={`${context.totals.sites} sites loaded from database`} />
                <SelectField label="Router Group" name="routerGroup" options={["Core", "Edge", "Branch", "Wireless", "Lab"]} />
                <FieldInput label="Model" name="model" placeholder="CCR2004-1G-12S+2XS" value={model} onChange={setModel} />
                <FieldInput label="Serial Number" name="serialNumber" placeholder="Optional asset serial" value={serialNumber} onChange={setSerialNumber} />
                <FieldInput label="RouterOS Version" name="routerOs" placeholder="7.15.3" value={routerOs} onChange={setRouterOs} />
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
              <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
                <Network className="h-5 w-5 text-blue-600" />
                <div>
                  <h2 className="text-base font-extrabold text-slate-950">Management Endpoints</h2>
                  <p className="text-xs font-semibold text-slate-500">Define how MikroTik Manager reaches the router before any configuration read.</p>
                </div>
              </div>
              <div className="grid gap-4 p-5 lg:grid-cols-4">
                <div className="space-y-2 lg:col-span-2">
                  <FieldInput label="Host / IP Address" name="host" placeholder="10.10.1.1" required value={host} onChange={setHost} helper="Enter an IP address, then run detection to probe common MikroTik ports." />
                  <div className="flex flex-wrap items-center gap-2">
                    <button type="button" onClick={detectRouter} disabled={isPending} className="inline-flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-3 text-sm font-extrabold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                      <Search className="h-4 w-4" />
                      {isPending ? "Detecting..." : "Detect Router"}
                    </button>
                    {detectResult ? (
                      <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${detectResult.likelyMikroTik ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                        {detectResult.confidence}% confidence
                      </span>
                    ) : null}
                  </div>
                  {detectError ? <p className="text-xs font-extrabold text-red-600">{detectError}</p> : null}
                </div>
                <FieldInput label="RouterOS API Port" name="apiPort" placeholder="8728" type="number" value={apiPort} onChange={setApiPort} />
                <FieldInput label="REST Port" name="restPort" placeholder="443" type="number" value={restPort} onChange={setRestPort} />
                <FieldInput label="SSH Port" name="sshPort" placeholder="22" type="number" value={sshPort} onChange={setSshPort} />
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 lg:col-span-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-normal text-slate-500">Detection result</span>
                    {detectResult ? (
                      detectResult.ports.map((port) => (
                        <span key={port.port} className={`rounded-full px-2.5 py-1 text-xs font-extrabold ${port.open ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                          {port.service} {port.port}: {port.open ? "open" : "closed"}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm font-semibold text-slate-500">No detection run yet.</span>
                    )}
                  </div>
                  {detectResult?.message ? <p className="mt-2 text-xs font-semibold text-slate-500">{detectResult.message}</p> : null}
                  {detectResult?.identity?.source ? (
                    <p className="mt-2 text-xs font-extrabold text-emerald-700">Authenticated inventory source: {detectResult.identity.source}</p>
                  ) : null}
                  {detectResult?.detected.signals.length ? (
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-xs font-semibold text-slate-600">
                      {detectResult.detected.signals.map((signal) => (
                        <li key={signal}>{signal}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <div className="lg:col-span-4 grid gap-3 md:grid-cols-4">
                  <Toggle label="REST API" name="restEnabled" helper="Preferred for modern RouterOS." defaultChecked />
                  <Toggle label="RouterOS API" name="apiEnabled" helper="Use native API fallback." defaultChecked />
                  <Toggle label="SSH" name="sshEnabled" helper="Required for legacy checks." defaultChecked />
                  <Toggle label="TLS Required" name="tlsRequired" helper="Reject insecure REST sessions." defaultChecked />
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
              <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
                <KeyRound className="h-5 w-5 text-blue-600" />
                <div>
                  <h2 className="text-base font-extrabold text-slate-950">Credentials & Secrets</h2>
                  <p className="text-xs font-semibold text-slate-500">Reference vaulted credentials. Raw passwords are never displayed on this page.</p>
                </div>
              </div>
              <div className="grid gap-4 p-5 lg:grid-cols-3">
                <label className="space-y-1.5">
                  <span className="text-xs font-extrabold uppercase tracking-normal text-slate-500">Connection Method</span>
                  <span className="relative block">
                    <select
                      name="connectionMethod"
                      value={connectionMethod}
                      onChange={(event) => setConnectionMethod(event.target.value)}
                      className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                    >
                      {["REST API first", "RouterOS API first", "SSH first", "Auto select secure path"].map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
                  </span>
                </label>
                <SelectField label="Credential Profile" name="credentialProfile" options={["Select existing profile", "noc-readonly", "noc-config-admin", "branch-maintenance"]} />
                <Field label="Secret Vault Path" name="secretVaultPath" placeholder="vault/mikrotik/lagos/core-01" helper="Store references only. Do not paste secrets." />
                <div className="lg:col-span-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-4 flex items-start gap-3">
                    <KeyRound className="mt-0.5 h-5 w-5 text-slate-600" />
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-950">Credential Entry</h3>
                      <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
                        Enter credentials here when a vault profile does not already exist. They are submitted once, encrypted on the API, and stored as router-linked secret records.
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-3">
                    <Field label="RouterOS Username" name="routerUsername" placeholder="api-readonly" autoComplete="off" />
                    <Field label="RouterOS Password" name="routerPassword" placeholder="Enter RouterOS API password" type="password" autoComplete="new-password" />
                    <Field label="Enable Password" name="enablePassword" placeholder="Optional privileged mode secret" type="password" autoComplete="new-password" />
                    <Field label="SSH Username" name="sshUsername" placeholder="ssh-maintenance" autoComplete="off" />
                    <Field label="SSH Password / Key Passphrase" name="sshPassword" placeholder="Enter SSH credential" type="password" autoComplete="new-password" />
                    <label className="space-y-1.5">
                      <span className="text-xs font-extrabold uppercase tracking-normal text-slate-500">Credential Scope</span>
                      <span className="relative block">
                        <select
                          name="credentialScope"
                          className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                        >
                          <option>Read-only onboarding</option>
                          <option>Configuration management</option>
                          <option>Backup and restore</option>
                          <option>Full administrator</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
                      </span>
                    </label>
                  </div>
                </div>
                <div className="lg:col-span-3 rounded-lg border border-blue-100 bg-blue-50 p-4">
                  <div className="flex items-start gap-3">
                    <LockKeyhole className="mt-0.5 h-5 w-5 text-blue-700" />
                    <div>
                      <h3 className="text-sm font-extrabold text-blue-950">Secret handling policy</h3>
                      <p className="mt-1 text-sm font-semibold leading-6 text-blue-800">
                        Credentials are encrypted before storage and resolved at execution time from router-linked secrets or the selected vault profile. Validation logs store sanitized command labels only.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
              <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
                <FolderOpen className="h-5 w-5 text-blue-600" />
                <div>
                  <h2 className="text-base font-extrabold text-slate-950">Site Assignment</h2>
                  <p className="text-xs font-semibold text-slate-500">Place the device into operational ownership, tags and documentation context.</p>
                </div>
              </div>
              <div className="grid gap-4 p-5 lg:grid-cols-3">
                <Field label="Owner" name="owner" placeholder="Network Operations" />
                <Field label="Tags" name="tags" placeholder="core, production, lagos" />
                <Field label="License" name="license" placeholder="RouterOS license level" />
                <label className="space-y-1.5 lg:col-span-3">
                  <span className="text-xs font-extrabold uppercase tracking-normal text-slate-500">Notes</span>
                  <textarea
                    name="notes"
                    rows={4}
                    placeholder="Operational notes, onboarding context, rack position, or handover details."
                    className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
              <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
                <ClipboardCheck className="h-5 w-5 text-blue-600" />
                <div>
                  <h2 className="text-base font-extrabold text-slate-950">Validation & Baseline</h2>
                  <p className="text-xs font-semibold text-slate-500">Choose the controls applied before the router becomes active inventory.</p>
                </div>
              </div>
              <div className="grid gap-3 p-5 md:grid-cols-2">
                <Toggle label="Backup after onboarding" name="backupAfterOnboarding" helper="Create encrypted configuration backup." defaultChecked />
                <Toggle label="Create rollback point" name="createRollbackPoint" helper="Capture restore state before changes." defaultChecked />
                <Toggle label="Require approval" name="requireApproval" helper="Route high-risk onboarding through approvals." defaultChecked />
                <Toggle label="Read-only first run" name="readOnlyFirstRun" helper="Inventory and validate before write access." defaultChecked />
              </div>
            </section>
          </main>

          <aside className="space-y-5 xl:sticky xl:top-4 xl:self-start">
            <section className="rounded-xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <div>
                  <h2 className="text-base font-extrabold text-slate-950">Database Context</h2>
                  <p className="text-xs font-semibold text-slate-500">Live onboarding reference data from SQL Server.</p>
                </div>
                <Server className="h-5 w-5 text-blue-600" />
              </div>
              <div className="grid grid-cols-3 gap-2 p-5">
                {[
                  ["Routers", context.totals.routers],
                  ["Sites", context.totals.sites],
                  ["Organizations", context.totals.organizations]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="text-2xl font-extrabold text-slate-950">{value}</div>
                    <div className="text-xs font-extrabold uppercase tracking-normal text-slate-500">{label}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <div>
                  <h2 className="text-base font-extrabold text-slate-950">Onboarding Readiness</h2>
                  <p className="text-xs font-semibold text-slate-500">Run validation before saving.</p>
                </div>
                <ShieldQuestion className="h-5 w-5 text-blue-600" />
              </div>
              <div className="space-y-2 p-5">
                {dynamicReadiness.map(([label, status, state]) => (
                  <div key={label} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <span className="flex items-center gap-2 text-sm font-extrabold text-slate-800">
                      {state === "warning" ? <AlertTriangle className="h-4 w-4 text-amber-500" /> : <CircleDot className="h-4 w-4 text-slate-400" />}
                      {label}
                    </span>
                    <span className={`rounded-full border px-2.5 py-1 text-xs font-extrabold ${readinessClass(state)}`}>{status}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
              <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
                <TerminalSquare className="h-5 w-5 text-slate-600" />
                <div>
                  <h2 className="text-base font-extrabold text-slate-950">Planned Validation</h2>
                  <p className="text-xs font-semibold text-slate-500">Sanitized sequence preview.</p>
                </div>
              </div>
              <ol className="space-y-2 p-5">
                {plannedValidation.map((item, index) => (
                  <li key={item} className="flex gap-3 rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-slate-200">
                    <span className="font-extrabold text-blue-300">{String(index + 1).padStart(2, "0")}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-amber-600" />
                <div>
                  <h2 className="text-sm font-extrabold text-amber-950">Approval guardrail</h2>
                  <p className="mt-1 text-sm font-semibold leading-6 text-amber-800">
                    High-risk onboarding requires approval before execution.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
              <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
                <Network className="h-5 w-5 text-slate-600" />
                <div>
                  <h2 className="text-base font-extrabold text-slate-950">Recent DB Records</h2>
                  <p className="text-xs font-semibold text-slate-500">Latest routers read from inventory.</p>
                </div>
              </div>
              <div className="space-y-2 p-5">
                {context.recentRouters.length ? (
                  context.recentRouters.map((router) => (
                    <div key={router.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-extrabold text-slate-950">{router.name}</div>
                          <div className="mt-0.5 text-xs font-semibold text-slate-500">{router.host} - {router.site}</div>
                        </div>
                        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-extrabold text-slate-600">{router.status}</span>
                      </div>
                      <div className="mt-2 text-xs font-semibold text-slate-400">{formatDate(router.createdAt)}</div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm font-semibold text-slate-500">
                    No router records exist yet. Submitting this form will create the first inventory row.
                  </div>
                )}
              </div>
            </section>
          </aside>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
              <Tags className="h-4 w-4 text-slate-500" />
              Required fields are marked. Secrets are stored by reference only.
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button type="reset" className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-700">
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button type="button" className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-700">
                <FlaskConical className="h-4 w-4" />
                Test Connection
              </button>
              <button type="button" className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-700">
                <Save className="h-4 w-4" />
                Save Draft
              </button>
              <button type="submit" className="inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-extrabold text-white shadow-sm hover:bg-blue-700">
                <UploadCloud className="h-4 w-4" />
                Onboard Router
              </button>
            </div>
          </div>
        </div>

        <input type="hidden" name="status" value="Unknown" />
        <input type="hidden" name="healthScore" value="0" />
      </form>
    </div>
  );
}
