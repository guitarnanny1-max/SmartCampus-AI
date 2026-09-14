import {
  getPendingQueueItems,
  putQueueItem,
} from "./db";

import type {
  OfflineEntityType,
  OfflineOperationType,
  OfflineQueueItem,
} from "./types";

function createId(prefix: string): string {
  if (
    typeof crypto !== "undefined" &&
    "randomUUID" in crypto
  ) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2)}`;
}

export function getDeviceId(): string {
  if (typeof window === "undefined") {
    return "server";
  }

  const key = "smartcampusai-device-id";
  const existing = window.localStorage.getItem(key);

  if (existing) {
    return existing;
  }

  const deviceId = createId("device");

  window.localStorage.setItem(key, deviceId);

  return deviceId;
}

export async function enqueueOfflineOperation(args: {
  tenantId: string;
  userId: string;
  entityType: OfflineEntityType;
  operation: OfflineOperationType;
  entityId: string;
  payload: unknown;
}): Promise<OfflineQueueItem> {
  const now = new Date().toISOString();

  const item: OfflineQueueItem = {
    id: createId("queue"),
    operationId: createId("op"),
    tenantId: args.tenantId,
    userId: args.userId,
    deviceId: getDeviceId(),
    entityType: args.entityType,
    operation: args.operation,
    entityId: args.entityId,
    payload: args.payload,
    createdAt: now,
    attemptCount: 0,
    status: "PENDING",
    lastError: null,
    syncedAt: null,
  };

  await putQueueItem(item);

  return item;
}

export async function getPendingOperations(): Promise<
  OfflineQueueItem[]
> {
  return getPendingQueueItems();
}
