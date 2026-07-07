import type { Job } from "bullmq";

export async function backupProcessor(job: Job) {
  return { jobId: job.id, encrypted: true, versioned: true, rollbackPoint: true };
}
