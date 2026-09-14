"use client";

import { useEffect, useState } from "react";

import {
  clearQueue,
} from "@/lib/offline/db";

import {
  saveOfflineAttendance,
} from "@/lib/offline/attendance";

import {
  getPendingOperations,
} from "@/lib/offline/queue";

export default function OfflineTestPage() {
  const [pendingCount, setPendingCount] = useState(0);
  const [message, setMessage] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Intentional client-only initialization for browser-backed offline state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    void refreshQueue();
  }, []);

  async function refreshQueue() {
    try {
      const pending = await getPendingOperations();
      setPendingCount(pending.length);
    } catch (error) {
      console.error("Unable to read offline queue:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to read offline queue.",
      );
    }
  }

  async function saveTestAttendance() {
    try {
      setMessage("");

      const record = await saveOfflineAttendance({
        tenantId: "offline-test-tenant",
        userId: "offline-test-user",
        studentId: "offline-test-student",
        classId: "offline-test-class",
        sectionId: "offline-test-section",
        attendanceDate: new Date()
          .toISOString()
          .slice(0, 10),
        status: "PRESENT",
        source: "MANUAL",
      });

      await refreshQueue();

      setMessage(
        `Saved locally: ${record.id}`,
      );
    } catch (error) {
      console.error(
        "Offline attendance test failed:",
        error,
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to save offline attendance.",
      );
    }
  }

  async function resetQueue() {
    try {
      await clearQueue();
      await refreshQueue();
      setMessage("Test queue cleared.");
    } catch (error) {
      console.error(
        "Unable to clear test queue:",
        error,
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to clear test queue.",
      );
    }
  }

  if (!mounted) {
    return (
      <main className="mx-auto max-w-2xl p-8">
        <h1 className="text-2xl font-bold text-slate-950">
          Offline Attendance Test
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Loading offline storage…
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-bold text-slate-950">
        Offline Attendance Test
      </h1>

      <p className="mt-2 text-sm text-slate-600">
        Test local attendance persistence without
        connecting to Supabase.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-sm text-slate-600">
          Pending operations
        </div>

        <div className="mt-1 text-3xl font-bold">
          {pendingCount}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={saveTestAttendance}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Save Offline Attendance
          </button>

          <button
            type="button"
            onClick={refreshQueue}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Refresh Queue
          </button>

          <button
            type="button"
            onClick={resetQueue}
            className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700"
          >
            Clear Test Queue
          </button>
        </div>

        {message && (
          <p className="mt-4 text-sm font-medium text-slate-700">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
