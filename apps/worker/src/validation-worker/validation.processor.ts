import type { Job } from "bullmq";

export async function validationProcessor(job: Job) {
  return { jobId: job.id, valid: true, rollbackRequired: false };
}
