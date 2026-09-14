"use client";

import { useEffect, useState } from "react";
import {
  subscribeToNetworkStatus,
  type NetworkStatus,
} from "@/lib/offline/network";

export function OfflineIndicator() {
  const [status, setStatus] =
    useState<NetworkStatus>("ONLINE");

  useEffect(() => {
    return subscribeToNetworkStatus(setStatus);
  }, []);

  if (status === "ONLINE") {
    return null;
  }

  return (
    <div
      className="fixed bottom-4 left-1/2 z-[100] -translate-x-1/2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-800 shadow-lg"
      role="status"
      aria-live="polite"
    >
      Offline mode — changes will sync when connection returns
    </div>
  );
}
