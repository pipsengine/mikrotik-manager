import type { Job } from "bullmq";

export async function scheduledProcessor(job: Job) {
  return { jobId: job.id, jobs: ["automatic-backup", "health-check", "configuration-drift", "compliance-scan"] };
}
