export const roles = [
  "Super Administrator",
  "Network Administrator",
  "Network Engineer",
  "Security Administrator",
  "Helpdesk",
  "Auditor",
  "Read Only User",
  "Approver",
  "Operations Manager"
] as const;

export type Role = (typeof roles)[number];
