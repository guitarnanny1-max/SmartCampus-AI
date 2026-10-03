export const CRM_EVENT_TYPES = {
  // Lead / CRM
  LEAD_CREATED: "LEAD_CREATED",
  LEAD_UPDATED: "LEAD_UPDATED",
  LEAD_ASSIGNED: "LEAD_ASSIGNED",
  LEAD_QUALIFIED: "LEAD_QUALIFIED",
  LEAD_DISQUALIFIED: "LEAD_DISQUALIFIED",

  // Inbound
  INBOUND_WHATSAPP: "INBOUND_WHATSAPP",
  INBOUND_EMAIL: "INBOUND_EMAIL",
  INBOUND_VOICE: "INBOUND_VOICE",
  INBOUND_WEB_FORM: "INBOUND_WEB_FORM",
  MISSED_CALL: "MISSED_CALL",

  // Outbound
  OUTBOUND_WHATSAPP: "OUTBOUND_WHATSAPP",
  OUTBOUND_EMAIL: "OUTBOUND_EMAIL",
  OUTBOUND_VOICE: "OUTBOUND_VOICE",

  // Communication lifecycle
  MESSAGE_SENT: "MESSAGE_SENT",
  MESSAGE_DELIVERED: "MESSAGE_DELIVERED",
  MESSAGE_READ: "MESSAGE_READ",
  MESSAGE_REPLIED: "MESSAGE_REPLIED",
  MESSAGE_FAILED: "MESSAGE_FAILED",

  // Sales / CRM activity
  DEMO_REQUESTED: "DEMO_REQUESTED",
  DEMO_SCHEDULED: "DEMO_SCHEDULED",
  DEMO_COMPLETED: "DEMO_COMPLETED",
  PROPOSAL_CREATED: "PROPOSAL_CREATED",
  PROPOSAL_SENT: "PROPOSAL_SENT",
  PAYMENT_RECEIVED: "PAYMENT_RECEIVED",

  // Follow-up
  FOLLOW_UP_DUE: "FOLLOW_UP_DUE",
  FOLLOW_UP_COMPLETED: "FOLLOW_UP_COMPLETED",
  NO_RESPONSE: "NO_RESPONSE",

  // Manual
  MANUAL_ACTION: "MANUAL_ACTION",
} as const;

export type CrmEventType =
  (typeof CRM_EVENT_TYPES)[keyof typeof CRM_EVENT_TYPES];

export type CrmEventChannel =
  | "WHATSAPP"
  | "EMAIL"
  | "VOICE"
  | "WEB"
  | "SYSTEM"
  | "MANUAL";

export type CrmEvent = {
  type: CrmEventType;
  channel: CrmEventChannel;

  tenantId?: string | null;
  leadId?: string | null;
  customerId?: string | null;
  userId?: string | null;

  occurredAt?: Date;

  payload?: Record<string, unknown>;

  source?: string | null;
  externalId?: string | null;
};

export type CrmEventHandler = (
  event: CrmEvent
) => Promise<void>;

export function createCrmEvent(
  input: CrmEvent
): CrmEvent {
  return {
    ...input,
    occurredAt: input.occurredAt ?? new Date(),
    payload: input.payload ?? {},
  };
}
