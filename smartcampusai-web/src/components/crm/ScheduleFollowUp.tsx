"use client";

import { useState } from "react";
import { CalendarClock, Loader2, X } from "lucide-react";

type ScheduleFollowUpProps = {
  leadId: string;
  initialDate?: string | null;
  initialDemoDate?: string | null;
};

function toLocalInputValue(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 16);
}

function getMinDateTime() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const localNow = new Date(now.getTime() - offset * 60 * 1000);

  return localNow.toISOString().slice(0, 16);
}

export default function ScheduleFollowUp({
  leadId,
  initialDate,
  initialDemoDate,
}: ScheduleFollowUpProps) {
  const [open, setOpen] = useState(false);

  const [date, setDate] = useState(
    toLocalInputValue(initialDate),
  );

  const [demoDate, setDemoDate] = useState(
    toLocalInputValue(initialDemoDate),
  );

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function validateDates() {
    if (!date) {
      setError("Please select a follow-up date and time.");
      return false;
    }

    const now = new Date();

    const followUp = new Date(date);

    if (Number.isNaN(followUp.getTime())) {
      setError("Please enter a valid follow-up date and time.");
      return false;
    }

    if (followUp.getTime() <= now.getTime()) {
      setError("Follow-up date and time must be in the future.");
      return false;
    }

    if (demoDate) {
      const demo = new Date(demoDate);

      if (Number.isNaN(demo.getTime())) {
        setError("Please enter a valid demo date and time.");
        return false;
      }

      if (demo.getTime() <= now.getTime()) {
        setError("Demo date and time must be in the future.");
        return false;
      }

      if (demo.getTime() < followUp.getTime()) {
        setError(
          "Demo date and time cannot be earlier than the follow-up date and time.",
        );
        return false;
      }
    }

    return true;
  }

  async function scheduleFollowUp() {
    setError("");
    setMessage("");

    if (!validateDates()) {
      return;
    }

    setSaving(true);

    try {
      const followUpISO = new Date(date).toISOString();

      const demoISO = demoDate
        ? new Date(demoDate).toISOString()
        : null;

      const response = await fetch(
        `/api/crm/leads/${leadId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            next_follow_up_at: followUpISO,
            demo_date: demoISO,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ||
            result?.message ||
            "Unable to schedule follow-up.",
        );
      }

      const activityResponse = await fetch(
        `/api/crm/leads/${leadId}/activities`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            activityType: "FOLLOW_UP",
            title: demoISO
              ? "Follow-up and demo scheduled"
              : "Follow-up scheduled",
            description: demoISO
              ? `Follow-up scheduled for ${new Date(
                  followUpISO,
                ).toLocaleString("en-IN")}. Demo scheduled for ${new Date(
                  demoISO,
                ).toLocaleString("en-IN")}.`
              : `Follow-up scheduled for ${new Date(
                  followUpISO,
                ).toLocaleString("en-IN")}.`,
          }),
        },
      );

      if (!activityResponse.ok) {
        console.warn(
          "Lead updated, but activity creation failed.",
        );
      }

      setMessage(
        demoISO
          ? "Follow-up and demo scheduled successfully."
          : "Follow-up scheduled successfully.",
      );

      setTimeout(() => {
        window.location.reload();
      }, 700);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to schedule follow-up.",
      );
    } finally {
      setSaving(false);
    }
  }

  const minDateTime = getMinDateTime();

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setError("");
          setMessage("");
        }}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        <CalendarClock className="h-4 w-4" />
        Schedule Follow-up
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CalendarClock className="h-5 w-5 text-indigo-600" />

                  <h2 className="text-lg font-bold text-slate-950">
                    Schedule Follow-up
                  </h2>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Set the next follow-up and optional demo date.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={saving}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-60"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="follow-up-date"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  Follow-up Date & Time
                </label>

                <input
                  id="follow-up-date"
                  type="datetime-local"
                  value={date}
                  min={minDateTime}
                  onChange={(event) => {
                    setDate(event.target.value);
                    setError("");
                  }}
                  disabled={saving}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="demo-date"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  Demo Date & Time
                </label>

                <input
                  id="demo-date"
                  type="datetime-local"
                  value={demoDate}
                  min={date || minDateTime}
                  onChange={(event) => {
                    setDemoDate(event.target.value);
                    setError("");
                  }}
                  disabled={saving}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-60"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Demo date must be after the follow-up date.
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {message && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {message}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={saving}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={scheduleFollowUp}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CalendarClock className="h-4 w-4" />
                    Schedule
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
