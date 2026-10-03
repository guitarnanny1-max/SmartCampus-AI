import { prisma } from "@/lib/prisma";
import {
  createAutomationExecution,
  runAutomationExecution,
} from "@/lib/platform-crm/automation-engine";
import {
  CrmEvent,
  CrmEventHandler,
  createCrmEvent,
} from "@/lib/platform-crm/events";

const handlers = new Map<string, CrmEventHandler[]>();

export function registerCrmEventHandler(
  eventType: string,
  handler: CrmEventHandler
) {
  const existing = handlers.get(eventType) ?? [];

  existing.push(handler);

  handlers.set(eventType, existing);
}

export async function dispatchCrmEvent(event: CrmEvent) {
  const normalizedEvent = createCrmEvent(event);

  const automationResult =
    await triggerAutomationsFromEvent(normalizedEvent);

  const eventHandlers =
    handlers.get(normalizedEvent.type) ?? [];

  const handlerResults = [];

  for (const handler of eventHandlers) {
    await handler(normalizedEvent);

    handlerResults.push({
      handler: handler.name || "anonymous",
      success: true,
    });
  }

  return {
    event: normalizedEvent,
    automationResult,
    handlerCount: eventHandlers.length,
    results: handlerResults,
  };
}

async function triggerAutomationsFromEvent(
  event: CrmEvent
) {
  const automations =
    await prisma.crmAutomation.findMany({
      where: {
        status: "ACTIVE",
        triggerType: event.type,
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        name: true,
        triggerType: true,
      },
    });

  const executions = [];

  for (const automation of automations) {
    const execution =
      await createAutomationExecution(
        automation.id,
        event.leadId ?? undefined,
        {
          event: {
            type: event.type,
            channel: event.channel,
            tenantId: event.tenantId ?? null,
            leadId: event.leadId ?? null,
            customerId: event.customerId ?? null,
            userId: event.userId ?? null,
            occurredAt:
              event.occurredAt?.toISOString() ??
              new Date().toISOString(),
            source: event.source ?? null,
            externalId: event.externalId ?? null,
            payload: event.payload ?? {},
          },
        }
      );

    executions.push({
      automationId: automation.id,
      automationName: automation.name,
      executionId: execution.id,
    });
  }

  for (const execution of executions) {
    await runAutomationExecution(execution.executionId);
  }

  return {
    eventType: event.type,
    matchedAutomationCount: automations.length,
    executions,
  };
}

export function getRegisteredEventTypes() {
  return Array.from(handlers.keys());
}
