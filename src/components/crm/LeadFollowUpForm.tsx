"use client";

import { useState } from "react";
import { CalendarClock, CheckCircle2 } from "lucide-react";

type LeadFollowUpFormProps = {
  leadId: string;
  lastContactedAt: string | null;
  nextFollowUpAt: string | null;
  demoDate: string | null;
};

function toDateTimeLocal(value: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 16);
}

function toIso(value: string) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

export default function LeadFollowUpForm({
  leadId,
  lastContactedAt,
  nextFollowUpAt,
  demoDate,
}: LeadFollowUpFormProps) {
  const [lastContacted, setLastContacted] = useState(
    toDateTimeLocal(lastContactedAt),
  );

  const [nextFollowUp, setNextFollowUp] = useState(
    toDateTimeLocal(nextFollowUpAt),
  );

  const [demo, setDemo] = useState(toDateTimeLocal(demoDate));

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function saveFollowUp() {
    setSaving(true);
    setSaved(false);
    setError("");

    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          last_contacted_at: toIso(lastContacted),
          next_follow_up_at: toIso(nextFollowUp),
          demo_date: toIso(demo),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error || "Unable to save follow-up details.",
        );
      }

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (err) {
      console.error("Lead follow-up update error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save follow-up details.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
          <CalendarClock className="h-5 w-5" />
        </div>

        <div>
          <h2 className="font-semibold text-slate-950">
            Follow-up Management
          </h2>

          <p className="text-sm text-slate-500">
            Track sales contact, upcoming follow-ups, and demonstrations.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <div>
          <label
            htmlFor="last-contacted"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Last Contacted
          </label>

          <input
            id="last-contacted"
            type="datetime-local"
            value={lastContacted}
            onChange={(event) => setLastContacted(event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label
            htmlFor="next-follow-up"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Next Follow-up
          </label>

          <input
            id="next-follow-up"
            type="datetime-local"
            value={nextFollowUp}
            onChange={(event) => setNextFollowUp(event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label
            htmlFor="demo-date"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Demo Date
          </label>

          <input
            id="demo-date"
            type="datetime-local"
            value={demo}
            onChange={(event) => setDemo(event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-5 flex items-center justify-end gap-3">
        {saved && (
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            Saved successfully
          </div>
        )}

        <button
          type="button"
          onClick={saveFollowUp}
          disabled={saving}
          className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Follow-up"}
        </button>
      </div>
    </section>
  );
}
