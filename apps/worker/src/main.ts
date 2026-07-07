import { Worker } from "bullmq";
import { backupProcessor } from "./backup-worker/backup.processor.js";
import { discoveryProcessor } from "./discovery-worker/discovery.processor.js";
import { validationProcessor } from "./validation-worker/validation.processor.js";
import { notificationProcessor } from "./notification-worker/notification.processor.js";
import { scheduledProcessor } from "./scheduled-jobs/scheduled.processor.js";

const connection = { url: process.env.REDIS_URL ?? "redis://localhost:6379" };

const workers = [
  new Worker("backup", backupProcessor, { connection }),
  new Worker("discovery", discoveryProcessor, { connection }),
  new Worker("validation", validationProcessor, { connection }),
  new Worker("notification", notificationProcessor, { connection }),
  new Worker("scheduled", scheduledProcessor, { connection })
];

for (const worker of workers) {
  worker.on("completed", (job) => console.log(`${worker.name}:${job.id} completed`));
  worker.on("failed", (job, error) => console.error(`${worker.name}:${job?.id} failed`, error));
}
