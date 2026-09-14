import { getOfflineAccessState } from "./entitlement";
import { getNetworkStatus } from "./network";

export type OfflineFeature =
  | "ATTENDANCE"
  | "FEE_COLLECTION";

export interface OfflinePolicyResult {
  allowed: boolean;
  mode: "ONLINE" | "OFFLINE";
  reason: string;
}

export async function checkOfflineFeature(
  tenantId: string,
  feature: OfflineFeature,
): Promise<OfflinePolicyResult> {
  const mode = getNetworkStatus();

  if (mode === "ONLINE") {
    return {
      allowed: true,
      mode,
      reason: "Online mode.",
    };
  }

  const entitlement =
    await getOfflineAccessState(tenantId);

  if (!entitlement.allowed) {
    return {
      allowed: false,
      mode,
      reason: entitlement.message,
    };
  }

  if (feature === "ATTENDANCE") {
    return {
      allowed: true,
      mode,
      reason:
        "Attendance is available under the cached offline entitlement.",
    };
  }

  if (feature === "FEE_COLLECTION") {
    return {
      allowed: true,
      mode,
      reason:
        "Fee collection is available offline and will remain pending until synchronized and validated by the server.",
    };
  }

  return {
    allowed: false,
    mode,
    reason: "Offline feature is not enabled.",
  };
}
