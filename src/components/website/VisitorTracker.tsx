"use client";

import { useEffect } from "react";

const VISITOR_ID_KEY = "smartcampus_visitor_id";
const SESSION_ID_KEY = "smartcampus_session_id";

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function getOrCreateStorageId(key: string) {
  try {
    const existing = window.localStorage.getItem(key);

    if (existing) {
      return existing;
    }

    const id = createId();

    window.localStorage.setItem(key, id);

    return id;
  } catch {
    return createId();
  }
}

export default function VisitorTracker() {
  useEffect(() => {
    let cancelled = false;

    async function trackVisitor() {
      try {
        const visitorId =
          getOrCreateStorageId(VISITOR_ID_KEY);

        const sessionId =
          getOrCreateStorageId(SESSION_ID_KEY);

        if (cancelled) {
          return;
        }

        await fetch("/api/analytics/visit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            visitorId,
            sessionId,
            pagePath: window.location.pathname,
            referrer: document.referrer || "",
          }),
          keepalive: true,
        });
      } catch (error) {
        console.error(
          "Visitor tracking failed:",
          error,
        );
      }
    }

    trackVisitor();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
