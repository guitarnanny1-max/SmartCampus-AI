import {
  getPendingQueueItems,
  updateQueueItem,
} from "./db";

import type {
  OfflineQueueItem,
} from "./types";

export interface SyncResult {
  processed: number;
  synced: number;
  failed: number;
  conflicts: number;
}

let syncInProgress = false;

export async function syncOfflineQueue(): Promise<SyncResult> {
  if (syncInProgress) {
    return {
      processed: 0,
      synced: 0,
      failed: 0,
      conflicts: 0,
    };
  }

  if (
    typeof navigator !== "undefined" &&
    !navigator.onLine
  ) {
    return {
      processed: 0,
      synced: 0,
      failed: 0,
      conflicts: 0,
    };
  }

  syncInProgress = true;

  try {
    const items = await getPendingQueueItems();

    const result: SyncResult = {
      processed: items.length,
      synced: 0,
      failed: 0,
      conflicts: 0,
    };

    for (const item of items) {
      const outcome = await syncOne(item);

      if (outcome === "SYNCED") {
        result.synced += 1;
      } else if (outcome === "CONFLICT") {
        result.conflicts += 1;
      } else {
        result.failed += 1;
      }
    }

    return result;
  } finally {
    syncInProgress = false;
  }
}

async function syncOne(
  item: OfflineQueueItem,
): Promise<
  "SYNCED" | "FAILED" | "CONFLICT"
> {
  await updateQueueItem(item.id, {
    status: "SYNCING",
    attemptCount: item.attemptCount + 1,
    lastError: null,
  });

  try {
    const response = await fetch(
      "/api/offline/sync",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-Offline-Operation-Id":
            item.operationId,
        },
        body: JSON.stringify(item),
      },
    );

    if (response.status === 409) {
      await updateQueueItem(item.id, {
        status: "CONFLICT",
        lastError:
          "Server reported a synchronization conflict.",
      });

      return "CONFLICT";
    }

    if (!response.ok) {
      const body = await response
        .json()
        .catch(() => null);

      const message =
        typeof body?.error === "string"
          ? body.error
          : `Sync failed with HTTP ${response.status}.`;

      await updateQueueItem(item.id, {
        status: "FAILED",
        lastError: message,
      });

      return "FAILED";
    }

    await updateQueueItem(item.id, {
      status: "SYNCED",
      syncedAt: new Date().toISOString(),
      lastError: null,
    });

    return "SYNCED";
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Network synchronization failed.";

    await updateQueueItem(item.id, {
      status: "FAILED",
      lastError: message,
    });

    return "FAILED";
  }
}
