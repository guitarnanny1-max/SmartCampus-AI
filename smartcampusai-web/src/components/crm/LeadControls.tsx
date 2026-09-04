"use client";

import { useState } from "react";
import {
  CalendarClock,
  Check,
  Loader2,
  Plus,
} from "lucide-react";

type LeadControlsProps = {
  leadId: string;
  initialStatus: string;
  initialPriority: string;
};

const STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "DEMO_SCHEDULED",
  "CONVERTED",
  "LOST",
];

const PRIORITIES = ["LOW", "MEDIUM", "HIGH"];

function label(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
}

export default function LeadControls({
  leadId,
  initialStatus,
  initialPriority,
}: LeadControlsProps) {
  const [status, setStatus] = useState(
    initialStatus || "NEW",
  );

  const [priority, setPriority] = useState(
    initialPriority || "MEDIUM",
  );

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function updateLead(
    payload: Record<string, string>,
  ) {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(
        `/api/crm/leads/${leadId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ||
            result?.message ||
            "Unable to update lead.",
        );
      }

      setMessage("Saved successfully.");

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to update lead.",
      );
    } finally {
      setSaving(false);
    }
  }

  function handleStatusChange(
    nextStatus: string,
  ) {
    setStatus(nextStatus);

    void updateLead({
      status: nextStatus,
    });
  }

  function handlePriorityChange(
    nextPriority: string,
  ) {
    setPriority(nextPriority);

    void updateLead({
      priority: nextPriority,
    });
  }

  function openFollowUp() {
    const element =
      document.getElementById(
        "lead-follow-up",
      );

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      const input =
        element.querySelector(
          "input",
        ) as HTMLInputElement | null;

      input?.focus();
    }
  }

  function openActivityForm() {
    const element =
      document.getElementById(
        "lead-activity-timeline",
      );

    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    const button =
      element.querySelector(
        '[data-add-activity="true"]',
      ) as HTMLButtonElement | null;

    button?.click();
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5">

        <div>
          <h2 className="text-lg font-bold text-slate-950">
            Lead Controls
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Update the sales pipeline status and priority.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Status
            </span>

            <select
              value={status}
              disabled={saving}
              onChange={(event) =>
                handleStatusChange(
                  event.target.value,
                )
              }
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {STATUSES.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {label(item)}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Priority
            </span>

            <select
              value={priority}
              disabled={saving}
              onChange={(event) =>
                handlePriorityChange(
                  event.target.value,
                )
              }
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {PRIORITIES.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {label(item)}
                </option>
              ))}
            </select>
          </label>

        </div>

        {saving && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving changes...
          </div>
        )}

        {!saving && message && (
          <div
            className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${
              message.includes("Unable") ||
              message.includes("Invalid")
                ? "border border-red-200 bg-red-50 text-red-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {!message.includes("Unable") &&
              !message.includes("Invalid") && (
                <Check className="h-4 w-4" />
              )}

            {message}
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">

          <button
            type="button"
            onClick={openFollowUp}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CalendarClock className="h-4 w-4" />
            Schedule Follow-up
          </button>

          <button
            type="button"
            onClick={openActivityForm}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            Add Activity
          </button>

        </div>
      </div>
    </section>
  );
}
