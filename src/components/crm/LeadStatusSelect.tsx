"use client";

import { useState } from "react";

const STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "DEMO_SCHEDULED",
  "CONVERTED",
  "LOST",
] as const;

type LeadStatus = (typeof STATUSES)[number];

function normalizeStatus(value: string): LeadStatus {
  const normalized = value.toUpperCase().replace(/[-\s]+/g, "_");

  if (STATUSES.includes(normalized as LeadStatus)) {
    return normalized as LeadStatus;
  }

  return "NEW";
}

function statusLabel(status: string) {
  return normalizeStatus(status)
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function LeadStatusSelect({
  leadId,
  currentStatus,
}: {
  leadId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState<LeadStatus>(
    normalizeStatus(currentStatus),
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    const nextStatus = normalizeStatus(event.target.value);

    if (nextStatus === status) {
      return;
    }

    const previousStatus = status;

    setStatus(nextStatus);
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: nextStatus,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error || "Unable to update lead status.",
        );
      }
    } catch (err) {
      console.error("Lead status update error:", err);

      setStatus(previousStatus);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update lead status.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <select
        value={status}
        onChange={handleChange}
        disabled={saving}
        aria-label="Change lead status"
        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {STATUSES.map((item) => (
          <option key={item} value={item}>
            {statusLabel(item)}
          </option>
        ))}
      </select>

      {saving && (
        <span className="text-[11px] text-slate-400">
          Saving...
        </span>
      )}

      {error && (
        <span className="max-w-56 text-[11px] text-red-600">
          {error}
        </span>
      )}
    </div>
  );
}
