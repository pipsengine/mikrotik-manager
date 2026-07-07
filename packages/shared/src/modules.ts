export type ModuleKey =
  | "dashboard"
  | "router-management"
  | "configuration-center"
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
  "router-management": enterprisePalette.cyan,
  "configuration-center": "#4F46E5",
  "ai-network-assistant": enterprisePalette.purple,
  "change-management": enterprisePalette.amber,
  "backup-restore": "#0284C7",
  monitoring: enterprisePalette.green,
  security: enterprisePalette.red,
  reports: enterprisePalette.orange,
  administration: enterprisePalette.slate,
  profile: enterprisePalette.primary
};
