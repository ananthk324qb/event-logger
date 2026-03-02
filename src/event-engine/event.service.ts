import { auditQueue } from "./audit.queue";
import { v4 as uuid } from "uuid";
import { AuditEvent } from "./event.types";

export async function logEvent(event: Omit<AuditEvent, "eventId">) {
  await auditQueue.add(
    "store-event",
    {
      ...event,
      eventId: uuid(),
    },
    {
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 },
      removeOnComplete: true,
    },
  );
}
