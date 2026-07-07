import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AddRouterPage, type AddRouterContext } from "@/components/router-management/add-router-page";

const apiBaseUrl = process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000/api";

export const metadata: Metadata = {
  title: "Add Router",
  description: "Securely onboard REST API, RouterOS API and SSH-enabled MikroTik routers."
};

function emptyAddRouterContext(): AddRouterContext {
  return {
    organizations: [],
    sites: [],
    recentRouters: [],
    totals: { routers: 0, sites: 0, organizations: 0 }
  };
}

async function getOnboardingContext(): Promise<AddRouterContext> {
  try {
    const response = await fetch(`${apiBaseUrl}/mikrotik/inventory/onboarding-context`, { cache: "no-store" });
    if (!response.ok) return emptyAddRouterContext();
    return response.json() as Promise<AddRouterContext>;
  } catch {
    return emptyAddRouterContext();
  }
}

async function createRouterAction(formData: FormData) {
  "use server";

  const numberOrUndefined = (value: FormDataEntryValue | null) => {
    const raw = String(value ?? "").trim();
    if (!raw) return undefined;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  const payload = {
    name: String(formData.get("name") ?? "").trim(),
    host: String(formData.get("host") ?? "").trim(),
    siteName: String(formData.get("siteName") ?? "").trim() || undefined,
    apiPort: numberOrUndefined(formData.get("apiPort")),
    restPort: numberOrUndefined(formData.get("restPort")),
    sshPort: numberOrUndefined(formData.get("sshPort")),
    model: String(formData.get("model") ?? "").trim() || undefined,
    serialNumber: String(formData.get("serialNumber") ?? "").trim() || undefined,
    license: String(formData.get("license") ?? "").trim() || undefined,
    routerOs: String(formData.get("routerOs") ?? "").trim() || undefined,
    credentialProfile: String(formData.get("credentialProfile") ?? "").trim() || undefined,
    secretVaultPath: String(formData.get("secretVaultPath") ?? "").trim() || undefined,
    routerUsername: String(formData.get("routerUsername") ?? "").trim() || undefined,
    routerPassword: String(formData.get("routerPassword") ?? "").trim() || undefined,
    enablePassword: String(formData.get("enablePassword") ?? "").trim() || undefined,
    sshUsername: String(formData.get("sshUsername") ?? "").trim() || undefined,
    sshPassword: String(formData.get("sshPassword") ?? "").trim() || undefined,
    status: String(formData.get("status") ?? "Unknown"),
    healthScore: numberOrUndefined(formData.get("healthScore")) ?? 0
  };

  if (!payload.name || !payload.host) return;

  const response = await fetch(`${apiBaseUrl}/mikrotik/inventory`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Unable to onboard router: ${response.status}`);
  }

  redirect("/router-management/routers");
}

export default async function Page() {
  const context = await getOnboardingContext();
  return <AddRouterPage context={context} createRouterAction={createRouterAction} />;
}
