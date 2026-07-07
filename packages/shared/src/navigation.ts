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
    items: [item("dashboard", "AI-NOC Dashboard", "/dashboard", "dashboard.view", "LayoutDashboard", ["ai-noc", "executive", "kpi", "availability", "incidents"], "Enterprise Network Operations Center with executive, operational and real-time AI-assisted KPIs.")]
  },
  {
    title: "AI-NOC 2.0",
    module: "ai-noc",
    icon: "BrainCircuit",
    permission: "aiNoc.view",
    items: [
      item("ai-noc", "Network Digital Twin", "/ai-noc/network-digital-twin", "aiNoc.digitalTwin.view", "Network", ["topology", "digital twin", "links", "vlan"], "Interactive topology from internet, ISP, firewall, router, switches, access points, servers, clients and unknown devices."),
      item("ai-noc", "Network Assets", "/ai-noc/network-assets", "aiNoc.assets.manage", "Boxes", ["asset", "inventory", "lifecycle"], "Network asset management for laptops, servers, printers, APs, routers, switches, firewalls, IoT, UPS and unknown devices."),
      item("ai-noc", "Identity Networking", "/ai-noc/identity-networking", "aiNoc.identity.manage", "UsersRound", ["identity", "employee", "role", "policy"], "Identity-based networking where user, department, role and device determine bandwidth, apps, web access and schedules."),
      item("ai-noc", "Policy Templates", "/ai-noc/policy-templates", "aiNoc.templates.manage", "Library", ["template", "finance", "guest", "iot"], "Reusable policy templates for executive, finance, HR, IT, guest, contractor, server, CCTV, printer, VoIP, IoT and high-security networks."),
      item("ai-noc", "AI Policy Optimizer", "/ai-noc/ai-policy-optimizer", "aiNoc.optimizer.view", "Sparkles", ["optimizer", "recommendation", "cleanup"], "AI recommendations for bandwidth, VLANs, firewall cleanup, NAT, DHCP, QoS, stale lists and overlapping policies."),
      item("ai-noc", "Compliance Dashboard", "/ai-noc/compliance-dashboard", "aiNoc.compliance.view", "ClipboardCheck", ["compliance", "audit", "score"], "Continuous compliance for security, configuration, password policy, backup, firewall, firmware, VLAN, VPN and change management."),
      item("ai-noc", "Predictive AI", "/ai-noc/predictive-ai", "aiNoc.predictive.view", "TrendingUp", ["forecast", "capacity", "expiry"], "Forecast WAN saturation, DHCP pool exhaustion, storage, certificate expiry, backup failures, CPU load and bandwidth spikes."),
      item("ai-noc", "Configuration Drift", "/ai-noc/configuration-drift", "aiNoc.drift.view", "GitCompare", ["drift", "intended", "live"], "Compare intended and live configuration for firewall, NAT, VLANs, interfaces, routes, queues, DNS and DHCP drift."),
      item("ai-noc", "Risk Engine", "/ai-noc/risk-engine", "aiNoc.risk.view", "ShieldAlert", ["risk", "threshold", "approval"], "Risk scoring and approval thresholds for every proposed network change."),
      item("ai-noc", "Change Simulation", "/ai-noc/change-simulation", "aiNoc.simulation.view", "FlaskConical", ["dry run", "impact", "downtime"], "Dry-run change simulation with conflicts, impacted devices, services, downtime, dependencies and rollback complexity."),
      item("ai-noc", "Internet Quality", "/ai-noc/internet-quality", "aiNoc.quality.view", "Activity", ["latency", "jitter", "packet loss", "sla"], "Latency, jitter, packet loss, DNS response, gateway availability, WAN stability, ISP uptime and SLA tracking."),
      item("ai-noc", "Wi-Fi Analytics", "/ai-noc/wifi-analytics", "aiNoc.wifi.view", "Wifi", ["wireless", "signal", "roaming"], "Wireless client count, signal, roaming, channel use, retries, airtime, rogue APs, coverage and client experience."),
      item("ai-noc", "Approval Workspace", "/ai-noc/approval-workspace", "aiNoc.approvals.manage", "PanelTopOpen", ["diff", "simulation", "rollback"], "Enterprise approval workspace with current/proposed configuration, diff, risk, impact, simulation, rollback and AI rationale."),
      item("ai-noc", "Automation Library", "/ai-noc/automation-library", "aiNoc.automation.manage", "Workflow", ["recipes", "schedule", "conditions"], "Reusable automation recipes for backups, compliance, interface recovery, quarantine, social blocking, VPN restore and notifications."),
      item("ai-noc", "Multi-Site Hierarchy", "/ai-noc/multi-site-hierarchy", "aiNoc.sites.manage", "Map", ["organization", "region", "site", "rack"], "Organization, region, country, site, building, floor, rack, network, router and interface hierarchy with inheritance."),
      item("ai-noc", "Executive Dashboard", "/ai-noc/executive-dashboard", "aiNoc.executive.view", "BriefcaseBusiness", ["executive", "sla", "risk", "capacity"], "Non-technical dashboard for availability, uptime, security posture, incidents, SLA, AI recommendations and capacity forecast."),
      item("ai-noc", "Plugin Architecture", "/ai-noc/plugin-architecture", "aiNoc.plugins.manage", "Puzzle", ["plugins", "vendors", "integrations"], "Isolated, versioned plugins for vendors, cloud networking, endpoint telemetry, DNS filtering, SIEM, ITSM and identity providers."),
      item("ai-noc", "Integration API", "/ai-noc/integration-api", "aiNoc.integrations.manage", "Cable", ["api", "active directory", "siem", "itsm"], "Versioned, audited REST API for AD, Entra ID, LDAP, RADIUS, TACACS+, SIEM, ITSM, Teams, Slack and webhooks.")
    ]
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
    title: "Network Control Center",
    module: "network-control-center",
    icon: "Network",
    permission: "networkControl.view",
    items: [
      item("network-control-center", "Network Control Dashboard", "/network-control-center/dashboard", "networkControl.view", "LayoutDashboard", ["bandwidth", "devices", "policy", "blocked attempts"], "Bandwidth, device, policy, social media, streaming and high-risk access overview."),
      item("network-control-center", "Device Management", "/network-control-center/device-management", "networkControl.devices.manage", "MonitorSmartphone", ["devices", "mac", "ip", "dhcp", "bulk"], "Identify, assign, limit, block, schedule, quarantine and audit every network device."),
      item("network-control-center", "Device Detail", "/network-control-center/device-detail", "networkControl.devices.manage", "FileSearch", ["device profile", "history", "firewall hits", "queue"], "Full device profile with IP/MAC history, DHCP leases, bandwidth history, domains, policy timeline, alerts and admin actions."),
      item("network-control-center", "User Activity", "/network-control-center/user-activity", "networkControl.activity.view", "UserRoundSearch", ["visited domains", "activity", "dns", "policy"], "User and device activity with domains, category, policy, data consumed and allowed or blocked status."),
      item("network-control-center", "Bandwidth Utilization", "/network-control-center/bandwidth-utilization", "networkControl.bandwidth.view", "ChartNoAxesCombined", ["traffic", "utilization", "download", "upload"], "Overall, per-device, per-user, per-department, site, interface and VLAN utilization."),
      item("network-control-center", "Bandwidth Control", "/network-control-center/bandwidth-control", "networkControl.bandwidth.manage", "Gauge", ["simple queues", "queue tree", "pcq", "limits"], "Per-device, user, group, department, VLAN, guest, burst, priority and schedule-based bandwidth limits."),
      item("network-control-center", "Access Policies", "/network-control-center/access-policies", "networkControl.policies.manage", "ShieldCheck", ["policy", "approval", "exceptions"], "Reusable access policies with websites, applications, bandwidth, schedules, exceptions and approvals."),
      item("network-control-center", "Policy Management", "/network-control-center/policy-management", "networkControl.policies.manage", "ClipboardList", ["full access", "business only", "guest", "lunch"], "Reusable policies for full access, limited access, no social media, no streaming, guest, executive, IT and after-hours controls."),
      item("network-control-center", "Website Control", "/network-control-center/website-control", "networkControl.website.manage", "GlobeLock", ["block domains", "allowlist", "deny list", "dns"], "Block, allow, categorize, import and schedule website/domain restrictions."),
      item("network-control-center", "Application Control", "/network-control-center/application-control", "networkControl.applications.manage", "AppWindow", ["social media", "streaming", "gaming", "layer7"], "Manage social media, streaming, gaming, file sharing, messaging, remote access and unknown applications."),
      item("network-control-center", "Social Media Control", "/network-control-center/social-media-control", "networkControl.applications.manage", "MessagesSquare", ["facebook", "youtube", "tiktok", "instagram"], "Control social media sites and applications using DNS, domains, address lists and firewall policy."),
      item("network-control-center", "Time-Based Access", "/network-control-center/time-based-access", "networkControl.schedules.manage", "CalendarClock", ["schedule", "work hours", "lunch", "holiday"], "Daily, weekly, department, device, user, holiday, temporary and emergency access schedules."),
      item("network-control-center", "Special Access Devices", "/network-control-center/special-access-devices", "networkControl.specialAccess.manage", "BadgeCheck", ["executive", "server", "cctv", "bypass"], "Approved bypass devices with reason, expiry, scope, approver and usage audit."),
      item("network-control-center", "Firewall Configuration", "/network-control-center/firewall-configuration", "networkControl.firewall.manage", "Firewall", ["filter", "nat", "mangle", "address lists"], "Firewall filter, NAT, mangle, address lists, service ports, rule order, risk rating, AI recommendation, backup and approval workflow."),
      item("network-control-center", "Bulk Device Actions", "/network-control-center/bulk-device-actions", "networkControl.bulkActions.manage", "ListChecks", ["bulk", "apply policy", "quarantine", "export"], "Bulk policy, bandwidth, block, allow, group, special access, quarantine and export workflows."),
      item("network-control-center", "Policy Scheduler", "/network-control-center/policy-scheduler", "networkControl.schedules.manage", "Timer", ["scheduler", "policy", "override"], "Policy schedule timelines, overrides, emergency restores and conflict detection."),
      item("network-control-center", "Activity Logs", "/network-control-center/activity-logs", "audit.view", "ScrollText", ["audit", "admin", "blocked", "rollback"], "Complete audit trail for discovery, policy, firewall, bandwidth, special access, AI and rollback events."),
      item("network-control-center", "Usage Reports", "/network-control-center/usage-reports", "networkControl.reports.export", "FileBarChart", ["pdf", "excel", "csv", "websites"], "PDF, Excel and CSV reports for devices, bandwidth, usage, blocked attempts and visited domains.")
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
