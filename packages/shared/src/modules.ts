export type ModuleKey =
  | "dashboard"
  | "ai-noc"
  | "router-management"
  | "configuration-center"
  | "network-control-center"
  | "ai-network-assistant"
  | "change-management"
  | "backup-restore"
  | "monitoring"
  | "security"
  | "reports"
  | "administration"
  | "profile";

export const enterprisePalette = {
  primary: "#2563EB",
  green: "#16A34A",
  amber: "#F59E0B",
  red: "#DC2626",
  purple: "#7C3AED",
  orange: "#EA580C",
  cyan: "#06B6D4",
  slate: "#475569",
  background: "#FFFFFF",
  secondaryBackground: "#F8FAFC"
} as const;

export const moduleColors: Record<ModuleKey, string> = {
  dashboard: enterprisePalette.primary,
  "ai-noc": "#1D4ED8",
  "router-management": enterprisePalette.cyan,
  "configuration-center": "#4F46E5",
  "network-control-center": "#0F766E",
  "ai-network-assistant": enterprisePalette.purple,
  "change-management": enterprisePalette.amber,
  "backup-restore": "#0284C7",
  monitoring: enterprisePalette.green,
  security: enterprisePalette.red,
  reports: enterprisePalette.orange,
  administration: enterprisePalette.slate,
  profile: enterprisePalette.primary
};
