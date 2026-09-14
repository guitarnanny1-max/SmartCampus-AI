"use client";

import { useEffect } from "react";

import { syncOfflineQueue } from "@/lib/offline/sync";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
    }

    const sync = () => {
      void syncOfflineQueue();
    };

    window.addEventListener("online", sync);

    if (navigator.onLine) {
      void syncOfflineQueue();
    }

    return () => {
      window.removeEventListener("online", sync);
    };
  }, []);

  return null;
}
