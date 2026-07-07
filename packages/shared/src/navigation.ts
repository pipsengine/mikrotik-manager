import type { Permission } from "./permissions";
import type { ModuleKey } from "./modules";

export type NavigationItem = {
  title: string;
  route: string;
  permission: Permission;
  icon: string;
  breadcrumb: string[];
  keywords: string[];
  badge?: string;
  module: ModuleKey;
  description: string;
};

export type NavigationGroup = {
  title: string;
  module: ModuleKey;
  icon: string;
  route?: string;
  permission: Permission;
  items: NavigationItem[];
};

const item = (
  module: ModuleKey,
  title: string,
  route: string,
  permission: Permission,
  icon: string,
  keywords: string[],
  description: string,
  badge?: string
): NavigationItem => ({
  title,
  route,
  permission,
  icon,
  breadcrumb: ["Home", title],
  keywords,
  badge,
  module,
  description
});

export const navigationGroups: NavigationGroup[] = [
  {
    title: "Dashboard",
    module: "dashboard",
    icon: "LayoutDashboard",
    route: "/dashboard",
    permission: "dashboard.view",
    items: [item("dashboard", "Dashboard", "/dashboard", "dashboard.view", "LayoutDashboard", ["executive", "kpi", "health", "status"], "Executive KPIs, router status, pending changes, AI recommendations, backup and security posture.")]
  },
  {
    title: "Router Management",
    module: "router-management",
    icon: "Router",
    permission: "routers.view",
    items: [
      item("router-management", "Routers", "/router-management/routers", "routers.view", "Router", ["inventory", "profiles", "groups"], "Router inventory, profiles, groups, system information, hardware, license, RouterOS and services."),
      item("router-management", "Add Router", "/router-management/add-router", "routers.create", "PlusCircle", ["create", "credential", "site"], "Secure onboarding for REST API, API and SSH-enabled MikroTik routers."),
      item("router-management", "Test Connection", "/router-management/connection-test", "routers.testConnection", "Cable", ["rest", "api", "ssh", "latency"], "Connection diagnostics for RouterOS REST API, API and SSH."),
      item("router-management", "Router Discovery", "/router-management/discovery", "routers.discover", "Radar", ["scan", "subnet", "agent"], "Automatic router discovery across networks and sites."),
      item("router-management", "Router Health", "/router-management/health", "routers.health.view", "Activity", ["health", "cpu", "memory", "license"], "Health score, system resources, hardware inventory and service checks.")
    ]
  },
  {
    title: "Configuration Center",
    module: "configuration-center",
    icon: "SlidersHorizontal",
    permission: "configuration.view",
    items: [
      item("configuration-center", "WAN Setup", "/configuration-center/wan-setup", "configuration.view", "Cloud", ["wan", "internet", "uplink"], "WAN, PPPoE and internet uplink configuration planning."),
      item("configuration-center", "LAN Setup", "/configuration-center/lan-setup", "configuration.view", "Network", ["lan", "bridge"], "LAN, bridge and routing configuration management."),
      item("configuration-center", "IP Addresses", "/configuration-center/ip-addresses", "configuration.view", "AtSign", ["ip", "address"], "IP address assignments, routes and interface bindings."),
      item("configuration-center", "DHCP Server", "/configuration-center/dhcp-server", "configuration.view", "Server", ["dhcp", "lease"], "DHCP scopes, leases and reservations."),
      item("configuration-center", "DNS", "/configuration-center/dns", "configuration.view", "Globe2", ["dns", "resolver"], "DNS resolver, forwarding and cache controls."),
      item("configuration-center", "NAT", "/configuration-center/nat", "configuration.view", "Shuffle", ["nat", "masquerade"], "NAT, masquerade and port-forward planning."),
      item("configuration-center", "Firewall Rules", "/configuration-center/firewall-rules", "configuration.view", "Shield", ["firewall", "filter", "mangle"], "Firewall filter, mangle and address-list management."),
      item("configuration-center", "VLANs", "/configuration-center/vlans", "configuration.view", "Layers3", ["vlan", "tagging"], "VLAN tagging, trunks and access port planning."),
      item("configuration-center", "Wireless / SSID", "/configuration-center/wireless-ssid", "configuration.view", "Wifi", ["wireless", "ssid", "capsman"], "Wireless, SSID and CAPsMAN configuration."),
      item("configuration-center", "VPN", "/configuration-center/vpn", "configuration.view", "LockKeyhole", ["vpn", "wireguard", "ipsec", "openvpn", "l2tp", "sstp"], "WireGuard, IPSec, OpenVPN, L2TP and SSTP configuration."),
      item("configuration-center", "QoS / Bandwidth", "/configuration-center/qos-bandwidth", "configuration.view", "Gauge", ["qos", "queues", "bandwidth"], "Queues, QoS and bandwidth management.")
    ]
  },
  {
    title: "AI Network Assistant",
    module: "ai-network-assistant",
    icon: "Bot",
    permission: "ai.ask",
    items: [
      item("ai-network-assistant", "Ask AI", "/ai-network-assistant/ask-ai", "ai.ask", "MessageSquareText", ["natural language", "assistant"], "Natural-language AI network administrator for MikroTik operations."),
      item("ai-network-assistant", "Configuration Planner", "/ai-network-assistant/configuration-planner", "ai.plan", "Sparkles", ["plan", "risk"], "AI plans that read, analyze, estimate risk and generate change requests."),
      item("ai-network-assistant", "Risk Review", "/ai-network-assistant/risk-review", "ai.securityReview", "ShieldAlert", ["security", "risk"], "Security and operational risk review before approval."),
      item("ai-network-assistant", "Recommended Fixes", "/ai-network-assistant/recommended-fixes", "ai.recommendFix", "WandSparkles", ["recommendation", "best practice"], "AI best-practice and remediation recommendations."),
      item("ai-network-assistant", "AI Activity History", "/ai-network-assistant/activity-history", "audit.view", "History", ["audit", "agent"], "Complete AI agent action history and documentation.")
    ]
  },
  {
    title: "Change Management",
    module: "change-management",
    icon: "GitPullRequest",
    permission: "change.view",
    items: [
      item("change-management", "Change Requests", "/change-management/change-requests", "change.view", "GitPullRequest", ["draft", "review"], "ITIL change lifecycle from draft through validation and documentation.", "12"),
      item("change-management", "Pending Approvals", "/change-management/pending-approvals", "change.approve", "BadgeCheck", ["approval", "risk"], "Risk-based configurable multi-level approval queue.", "5"),
      item("change-management", "Approved Changes", "/change-management/approved-changes", "change.view", "CheckCircle2", ["approved"], "Approved changes ready for controlled execution."),
      item("change-management", "Rejected Changes", "/change-management/rejected-changes", "change.view", "XCircle", ["rejected"], "Rejected changes with approver notes."),
      item("change-management", "Execution History", "/change-management/execution-history", "change.view", "ListChecks", ["execute", "validate"], "Execution, validation and documentation history."),
      item("change-management", "Rollback Center", "/change-management/rollback-center", "change.rollback", "RotateCcw", ["rollback", "restore"], "Rollback points and recovery workflow.")
    ]
  },
  {
    title: "Backup & Restore",
    module: "backup-restore",
    icon: "Archive",
    permission: "backup.view",
    items: [
      item("backup-restore", "Configuration Backups", "/backup-restore/configuration-backups", "backup.view", "FileArchive", ["export", "versioned"], "Encrypted, versioned RouterOS configuration exports."),
      item("backup-restore", "System Backups", "/backup-restore/system-backups", "backup.view", "HardDriveDownload", ["binary", "system"], "Binary system backup management."),
      item("backup-restore", "Scheduled Backups", "/backup-restore/scheduled-backups", "backup.schedule", "CalendarClock", ["scheduled", "automatic"], "Automatic backup schedules and retention policies."),
      item("backup-restore", "Restore Backup", "/backup-restore/restore-backup", "backup.restore", "UploadCloud", ["restore"], "Controlled restore workflow with approval and validation."),
      item("backup-restore", "Backup History", "/backup-restore/backup-history", "backup.view", "Clock3", ["history", "audit"], "Backup execution, integrity and encryption audit trail.")
    ]
  },
  {
    title: "Monitoring",
    module: "monitoring",
    icon: "MonitorDot",
    permission: "monitoring.view",
    items: [
      item("monitoring", "Interfaces", "/monitoring/interfaces", "monitoring.view", "PanelTop", ["interfaces", "traffic"], "Interface status, throughput and errors."),
      item("monitoring", "Traffic Monitor", "/monitoring/traffic-monitor", "monitoring.view", "AreaChart", ["bandwidth", "traffic"], "Bandwidth, traffic and utilization charts."),
      item("monitoring", "CPU & Memory", "/monitoring/cpu-memory", "monitoring.view", "Cpu", ["cpu", "memory"], "CPU, memory, storage and temperature telemetry."),
      item("monitoring", "Logs", "/monitoring/logs", "monitoring.view", "ScrollText", ["logs", "events"], "Router logs and event search."),
      item("monitoring", "Alerts", "/monitoring/alerts", "monitoring.alerts.manage", "BellRing", ["alerts", "notifications"], "Alert policy, routing and acknowledgement.", "9"),
      item("monitoring", "Availability", "/monitoring/availability", "monitoring.view", "Signal", ["uptime", "sla"], "Availability, health score and SLA tracking.")
    ]
  },
  {
    title: "Security",
    module: "security",
    icon: "ShieldCheck",
    permission: "security.view",
    items: [
      item("security", "Access Control", "/security/access-control", "security.view", "KeyRound", ["rbac", "zero trust"], "Zero Trust access controls and policy review."),
      item("security", "Router Users", "/security/router-users", "security.audit", "UsersRound", ["users", "password"], "Router user and password audit."),
      item("security", "Firewall Audit", "/security/firewall-audit", "security.audit", "ShieldAlert", ["firewall", "exposure"], "Firewall, port exposure and weak rule audit."),
      item("security", "Service Hardening", "/security/service-hardening", "security.audit", "ShieldPlus", ["services", "hardening"], "RouterOS services audit and hardening recommendations."),
      item("security", "Brute-force Protection", "/security/brute-force-protection", "security.audit", "Ban", ["brute force", "login"], "Failed-login detection and brute-force protection."),
      item("security", "Security Baseline", "/security/baseline-compliance", "security.audit", "ClipboardCheck", ["compliance", "baseline"], "Compliance scan and baseline drift review."),
      item("security", "Secrets Vault", "/security/secrets-vault", "security.secrets.manage", "Vault", ["secrets", "encryption"], "Encrypted secrets vault for credentials and keys.")
    ]
  },
  {
    title: "Reports",
    module: "reports",
    icon: "FileText",
    permission: "reports.view",
    items: [
      item("reports", "Router Inventory", "/reports/router-inventory", "reports.view", "Router", ["inventory", "pdf", "excel"], "Professional router inventory reports."),
      item("reports", "Configuration Report", "/reports/configuration-report", "reports.view", "FileCog", ["configuration"], "Configuration reports and exports."),
      item("reports", "Firewall Report", "/reports/firewall-report", "reports.view", "Shield", ["firewall"], "Firewall and security posture reports."),
      item("reports", "Backup Report", "/reports/backup-report", "reports.view", "Archive", ["backup"], "Backup coverage and integrity reports."),
      item("reports", "Change Audit Report", "/reports/change-audit-report", "reports.view", "GitCompare", ["change", "audit"], "Change history and audit reports."),
      item("reports", "Health Report", "/reports/health-report", "reports.view", "HeartPulse", ["health"], "Health, availability and performance reports.")
    ]
  },
  {
    title: "Administration",
    module: "administration",
    icon: "Settings",
    permission: "admin.settings.manage",
    items: [
      item("administration", "Users", "/administration/users", "admin.users.manage", "UserCog", ["users", "accounts"], "Enterprise user, session, login history and device tracking."),
      item("administration", "Roles & Permissions", "/administration/roles-permissions", "admin.roles.manage", "ShieldCheck", ["roles", "permissions"], "Permission matrix for pages, buttons, APIs and actions."),
      item("administration", "Approval Matrix", "/administration/approval-matrix", "admin.settings.manage", "Workflow", ["approval", "risk"], "Risk-based multi-level approval workflow configuration."),
      item("administration", "System Settings", "/administration/system-settings", "admin.settings.manage", "Settings2", ["settings"], "Global platform settings, session timeout and password policy."),
      item("administration", "API Settings", "/administration/api-settings", "admin.settings.manage", "Webhook", ["api", "webhook"], "API, webhook, Teams, Slack and email notification settings."),
      item("administration", "Audit Logs", "/administration/audit-logs", "audit.view", "BookOpenCheck", ["audit", "logs"], "Immutable platform audit logs.")
    ]
  },
  {
    title: "Profile",
    module: "profile",
    icon: "CircleUserRound",
    route: "/profile",
    permission: "profile.view",
    items: [item("profile", "Profile", "/profile", "profile.view", "CircleUserRound", ["profile", "mfa", "device"], "Profile, MFA readiness, sessions and device history.")]
  }
];

export const navigationItems = navigationGroups.flatMap((group) => group.items);

export function findNavigationItem(route: string) {
  return navigationItems.find((entry) => entry.route === route);
}
