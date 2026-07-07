import type { Job } from "bullmq";

export async function notificationProcessor(job: Job) {
  return { jobId: job.id, channels: ["in-app", "email", "microsoft-teams-ready", "slack-ready", "webhook-ready"] };
}
