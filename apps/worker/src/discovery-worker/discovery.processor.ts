import type { Job } from "bullmq";

export async function discoveryProcessor(job: Job) {
  return { jobId: job.id, discovered: [], methods: ["RouterOS REST API", "RouterOS API", "SSH"] };
}
