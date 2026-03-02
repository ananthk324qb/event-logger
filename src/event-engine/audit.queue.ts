import { Queue } from "bullmq";
import { redisConnection } from "../infra/redis";

export const auditQueue = new Queue("audit-events", {
  connection: redisConnection,
});
