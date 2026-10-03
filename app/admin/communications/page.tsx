"use client";

import { useEffect, useState } from "react";

type CommunicationLog = {
  id: string;
  channel: string;
  direction: string;
  status: string;
  recipient: string | null;
  message: string | null;
  provider: string | null;
  externalId: string | null;
  error: string | null;
  attemptedAt: string;
  lead: {
    id: string;
    campus_name: string;
    contact_name: string | null;
  } | null;
  campaign: {
    id: string;
    name: string;
  } | null;
};

export default function CommunicationHistoryPage() {
  const [logs, setLogs] = useState<CommunicationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [channel, setChannel] = useState("");
  const [status, setStatus] = useState("");
  const [direction, setDirection] = useState("");

  async function loadLogs() {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (q.trim()) params.set("q", q.trim());
      if (channel) params.set("channel", channel);
      if (status) params.set("status", status);
      if (direction) params.set("direction", direction);

      const response = await fetch(
        `/api/platform-crm/communications?${params.toString()}`,
        {
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to load communication history.",
        );
      }

      setLogs(Array.isArray(data?.logs) ? data.logs : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load communication history.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs();
  }, [channel, status, direction]);

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    loadLogs();
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <p className="text-sm font-medium text-cyan-600">
            thomasG technologies • CRM
          </p>

          <div className="mt-1 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Communication History
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Audit trail for email, WhatsApp and voice campaign activity.
              </p>
            </div>

            <a
              href="/admin/campaigns"
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              ← Campaigns
            </a>
          </div>
        </div>

        <form
          onSubmit={submitSearch}
          className="mb-5 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-5"
        >
          <input
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Search lead, phone, message..."
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500 md:col-span-2"
          />

          <select
            value={channel}
            onChange={(event) => setChannel(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">All channels</option>
            <option value="EMAIL">Email</option>
            <option value="WHATSAPP">WhatsApp</option>
            <option value="VOICE">Voice</option>
          </select>

          <select
            value={direction}
            onChange={(event) => setDirection(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">All directions</option>
            <option value="OUTBOUND">Outbound</option>
            <option value="INBOUND">Inbound</option>
          </select>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            <option value="DRY_RUN">DRY_RUN</option>
            <option value="SENT">SENT</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="READ">READ</option>
            <option value="RECEIVED">RECEIVED</option>
            <option value="SKIPPED">SKIPPED</option>
            <option value="FAILED">FAILED</option>
          </select>

          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 md:col-span-5 md:w-fit"
          >
            Search
          </button>
        </form>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Date / Time
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Lead
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Channel
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Direction
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Recipient
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Message
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Status
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Provider
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-10 text-center text-slate-500"
                    >
                      Loading communication history...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-10 text-center text-slate-500"
                    >
                      No communication records found.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                        {new Date(log.attemptedAt).toLocaleString("en-IN")}
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">
                          {log.lead?.campus_name || "—"}
                        </div>

                        <div className="text-xs text-slate-500">
                          {log.lead?.contact_name || "—"}
                        </div>

                        {log.campaign && (
                          <div className="mt-1 text-xs text-cyan-600">
                            {log.campaign.name}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3 font-medium text-slate-700">
                        {log.channel}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {log.direction}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {log.recipient || "—"}
                      </td>

                      <td className="max-w-sm px-4 py-3 text-slate-600">
                        <div className="truncate" title={log.message || ""}>
                          {log.message || "—"}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                          {log.status}
                        </span>

                        {log.error && (
                          <div
                            className="mt-1 max-w-xs truncate text-xs text-red-600"
                            title={log.error}
                          >
                            {log.error}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {log.provider || "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
            Showing up to 200 communication records.
          </div>
        </div>
      </div>
    </main>
  );
}
