import { Queue } from "bullmq";
import { redisConfig } from "../infra/redis";

export const auditQueue = new Queue("events", {
  connection: redisConfig,
});
