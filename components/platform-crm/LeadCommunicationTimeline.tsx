"use client";

import { useEffect, useState } from "react";

type Communication = {
  id: string;
  channel: string;
  direction: string;
  status: string;
  recipient: string | null;
  message: string | null;
  provider: string | null;
  attemptedAt: string;
  completedAt: string | null;
  error: string | null;
  campaign: {
    id: string;
    name: string;
  } | null;
  campaignStep: {
    id: string;
    stepOrder: number;
    channel: string;
  } | null;
};

export default function LeadCommunicationTimeline({
  leadId,
}: {
  leadId: string;
}) {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/platform-crm/leads/${leadId}/communications`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error || "Failed to load communication history."
          );
        }

        setCommunications(data.communications || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load communication history."
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [leadId]);

  return (
    <section className="mt-8 border-t border-slate-800 pt-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold">
            Communication Timeline
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Complete email, WhatsApp and voice activity for this lead.
          </p>
        </div>

        <div className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-400">
          {communications.length} record
          {communications.length === 1 ? "" : "s"}
        </div>
      </div>

      {loading ? (
        <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-6 text-center text-sm text-slate-500">
          Loading communication history...
        </div>
      ) : error ? (
        <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      ) : communications.length === 0 ? (
        <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-6 text-center text-sm text-slate-500">
          No communication activity yet.
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {communications.map((communication) => {
            const date = new Date(communication.attemptedAt);

            return (
              <div
                key={communication.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-[10px] font-bold text-cyan-300">
                        {communication.channel}
                      </span>

                      <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-300">
                        {communication.direction}
                      </span>

                      <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-300">
                        {communication.status}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-slate-500">
                      {date.toLocaleString()}
                    </div>
                  </div>

                  <div className="text-xs text-slate-500">
                    {communication.provider || "—"}
                  </div>
                </div>

                {communication.message && (
                  <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900 p-3 text-sm leading-6 text-slate-300">
                    {communication.message}
                  </div>
                )}

                <div className="mt-3 grid gap-2 text-xs text-slate-500 md:grid-cols-2">
                  <div>
                    <span className="text-slate-600">Recipient:</span>{" "}
                    {communication.recipient || "—"}
                  </div>

                  <div>
                    <span className="text-slate-600">Campaign:</span>{" "}
                    {communication.campaign?.name ||
                      "Direct / Unassigned"}
                  </div>

                  {communication.campaignStep && (
                    <div>
                      <span className="text-slate-600">Step:</span>{" "}
                      {communication.campaignStep.stepOrder} •{" "}
                      {communication.campaignStep.channel}
                    </div>
                  )}

                  {communication.error && (
                    <div className="text-red-400">
                      <span className="text-red-500">Error:</span>{" "}
                      {communication.error}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
