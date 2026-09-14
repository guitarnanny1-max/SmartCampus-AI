import { getEntitlement } from "./db";

import type {
  OfflineEntitlement,
} from "./types";

export type OfflineAccessState =
  | "VALID"
  | "GRACE"
  | "EXPIRED"
  | "MISSING";

export interface OfflineAccessResult {
  state: OfflineAccessState;
  allowed: boolean;
  entitlement: OfflineEntitlement | null;
  message: string;
}

export async function getOfflineAccessState(
  tenantId: string,
): Promise<OfflineAccessResult> {
  const entitlement = await getEntitlement(tenantId);

  if (!entitlement) {
    return {
      state: "MISSING",
      allowed: false,
      entitlement: null,
      message:
        "This device has no cached subscription entitlement.",
    };
  }

  const now = Date.now();
  const expiresAt = Date.parse(entitlement.expiresAt);
  const graceUntil = Date.parse(entitlement.graceUntil);

  if (Number.isNaN(expiresAt) || Number.isNaN(graceUntil)) {
    return {
      state: "EXPIRED",
      allowed: false,
      entitlement,
      message:
        "The cached subscription entitlement is invalid.",
    };
  }

  if (now <= expiresAt) {
    return {
      state: "VALID",
      allowed: true,
      entitlement,
      message:
        "Offline access is covered by the active subscription.",
    };
  }

  if (now <= graceUntil) {
    return {
      state: "GRACE",
      allowed: true,
      entitlement,
      message:
        "Offline access is temporarily allowed during the subscription grace period.",
    };
  }

  return {
    state: "EXPIRED",
    allowed: false,
    entitlement,
    message:
      "Offline access has expired. Connect to the internet to revalidate the subscription.",
  };
}
