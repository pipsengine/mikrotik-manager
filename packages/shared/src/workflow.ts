export const changeStatuses = [
  "Draft",
  "Review",
  "Pending Approval",
  "Approved",
  "Executing",
  "Validation",
  "Completed",
  "Rollback",
  "Rejected"
] as const;

export type ChangeStatus = (typeof changeStatuses)[number];

export const executionGuardrail = [
  "Read",
  "Analyze",
  "Backup",
  "Plan",
  "Approval",
  "Execute",
  "Validate",
  "Document",
  "Rollback if necessary"
] as const;

export const aiAgents = [
  "Discovery Agent",
  "Planning Agent",
  "Security Agent",
  "Execution Agent",
  "Validation Agent",
  "Rollback Agent",
  "Documentation Agent",
  "Monitoring Agent"
] as const;

export const riskLevels = ["Low", "Medium", "High", "Critical"] as const;
