"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ClipboardList, RefreshCw } from "lucide-react";

type AuditLog = {
  id: string;
  actorUserId: string | null;
  actorEmail: string | null;
  action: string;
  resourceType: string;
  resourceId: string | null;
  description: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
};

export default function PlatformAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  async function loadLogs() {
    try {
      setError("");

      const response = await fetch("/api/platform/audit-logs?limit=100", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load audit logs.");
      }

      setLogs(data.logs ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load audit logs.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function initialLoad() {
      try {
        setError("");

        const response = await fetch("/api/platform/audit-logs?limit=100", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load audit logs.");
        }

        if (!cancelled) {
          setLogs(data.logs ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load audit logs.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    initialLoad();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleRefresh() {
    setRefreshing(true);
    await loadLogs();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/platform"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Platform Control Center
        </Link>

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="rounded-xl bg-slate-900 p-2 text-white">
                <ClipboardList className="h-5 w-5" />
              </div>
              <span className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Platform Administration
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Audit Logs
            </h1>

            <p className="mt-2 text-slate-600">
              Review important actions performed across the SmartCampusAI
              platform.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Platform Activity
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Showing the most recent platform audit events.
            </p>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center text-sm text-slate-500">
              Loading audit logs…
            </div>
          ) : logs.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <ClipboardList className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm font-medium text-slate-700">
                No audit events yet.
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Platform actions will appear here as audit logging is added.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Actor</th>
                    <th className="px-6 py-4 font-semibold">Action</th>
                    <th className="px-6 py-4 font-semibold">Resource</th>
                    <th className="px-6 py-4 font-semibold">Description</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">
                          {log.actorEmail ?? "System"}
                        </div>
                        {log.actorUserId ? (
                          <div className="mt-1 text-xs text-slate-400">
                            {log.actorUserId}
                          </div>
                        ) : null}
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {log.action}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        <div className="font-medium">{log.resourceType}</div>
                        {log.resourceId ? (
                          <div className="mt-1 text-xs text-slate-400">
                            {log.resourceId}
                          </div>
                        ) : null}
                      </td>

                      <td className="max-w-md px-6 py-4 text-sm text-slate-600">
                        {log.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
