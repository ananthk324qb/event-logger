export interface AuditEvent {
  eventId: string;
  entityType: string;
  entityId: string;
  eventType: string;
  actor: {
    userId: string;
    role?: string;
  };
  payload?: unknown;
  createdAt?: Date;
}
