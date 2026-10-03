export type CrmActionContext = {
  executionId: string;
  stepId: string;
  leadId?: string | null;
  config?: Record<string, unknown> | null;
  context: Record<string, unknown>;
};

export type CrmActionResult = {
  success?: boolean;
  executed?: boolean;
  actionType: string;
  [key: string]: unknown;
};

export type CrmActionHandler = (
  input: CrmActionContext
) => Promise<CrmActionResult>;

const handlers = new Map<string, CrmActionHandler>();

export function registerCrmAction(
  actionType: string,
  handler: CrmActionHandler,
) {
  handlers.set(actionType, handler);
}

export function getCrmActionHandler(
  actionType: string,
) {
  return handlers.get(actionType);
}

export function hasCrmAction(
  actionType: string,
) {
  return handlers.has(actionType);
}

export function getRegisteredCrmActions() {
  return Array.from(handlers.keys());
}

export async function executeCrmAction(
  actionType: string,
  input: CrmActionContext,
) {
  const handler = getCrmActionHandler(actionType);

  if (!handler) {
    throw new Error(
      `CRM action is not registered: ${actionType}`,
    );
  }

  return handler(input);
}
