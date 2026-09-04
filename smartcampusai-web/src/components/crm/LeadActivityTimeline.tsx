"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  CalendarClock,
  CheckCircle2,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  User,
} from "lucide-react";

type ActivityItem = {
  id: string;
  lead_id: string;
  activity_type: string;
  title: string;
  description: string | null;
  created_at: string;
  created_by: string | null;
};

type LeadActivityTimelineProps = {
  leadId: string;
};

function formatActivityDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function activityLabel(type: string) {
  return type
    .toUpperCase()
    .replace(/[-_]+/g, " ")
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function ActivityIcon({ type }: { type: string }) {
  switch (type.toUpperCase()) {
    case "CALL":
      return <Phone className="h-4 w-4" />;

    case "EMAIL":
      return <Mail className="h-4 w-4" />;

    case "MEETING":
    case "DEMO":
      return <CalendarClock className="h-4 w-4" />;

    case "NOTE":
      return <MessageSquare className="h-4 w-4" />;

    case "STATUS_CHANGE":
      return <CheckCircle2 className="h-4 w-4" />;

    default:
      return <Activity className="h-4 w-4" />;
  }
}

export default function LeadActivityTimeline({
  leadId,
}: LeadActivityTimelineProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [activityType, setActivityType] = useState("NOTE");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function loadActivities() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/crm/leads/${leadId}/activities`,
        {
          cache: "no-store",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error || "Unable to load lead activities.",
        );
      }

      setActivities(result.activities || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load lead activities.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadActivities();
  }, [leadId]);

  async function createActivity() {
    if (!title.trim()) {
      setError("Please enter an activity title.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `/api/crm/leads/${leadId}/activities`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            activityType,
            title: title.trim(),
            description: description.trim() || null,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error || "Unable to create lead activity.",
        );
      }

      setActivities((current) => [
        result.activity,
        ...current,
      ]);

      setTitle("");
      setDescription("");
      setActivityType("NOTE");
      setShowForm(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create lead activity.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-indigo-600" />

            <h2 className="text-lg font-bold text-slate-950">
              Activity Timeline
            </h2>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Track notes, calls, emails, demos, and follow-up activity.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowForm((current) => !current);
            setError("");
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          Add Activity
        </button>
      </div>

      {showForm && (
        <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="activity-type"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                Activity Type
              </label>

              <select
                id="activity-type"
                value={activityType}
                onChange={(event) =>
                  setActivityType(event.target.value)
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              >
                <option value="NOTE">Note</option>
                <option value="CALL">Call</option>
                <option value="EMAIL">Email</option>
                <option value="MEETING">Meeting</option>
                <option value="DEMO">Demo</option>
                <option value="FOLLOW_UP">Follow-up</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="activity-title"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                Title
              </label>

              <input
                id="activity-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Called school administrator"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>
          </div>

          <div className="mt-4">
            <label
              htmlFor="activity-description"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              Description
            </label>

            <textarea
              id="activity-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows={4}
              placeholder="Add details about this activity..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setError("");
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={createActivity}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Activity
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {error && !showForm && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-sm text-slate-500">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Loading activities...
          </div>
        ) : activities.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
            <Activity className="mx-auto h-9 w-9 text-slate-300" />

            <h3 className="mt-3 text-sm font-semibold text-slate-900">
              No activities yet
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Add the first note, call, email, or follow-up.
            </p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute bottom-0 left-5 top-0 w-px bg-slate-200" />

            <div className="space-y-6">
              {activities.map((activity) => (
                <article
                  key={activity.id}
                  className="relative flex gap-4"
                >
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white bg-indigo-50 text-indigo-600 shadow-sm">
                    <ActivityIcon type={activity.activity_type} />
                  </div>

                  <div className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-950">
                            {activity.title}
                          </h3>

                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                            {activityLabel(activity.activity_type)}
                          </span>
                        </div>

                        {activity.description && (
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                            {activity.description}
                          </p>
                        )}
                      </div>

                      <time className="shrink-0 text-xs text-slate-400">
                        {formatActivityDate(activity.created_at)}
                      </time>
                    </div>

                    <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                      <User className="h-3.5 w-3.5" />

                      {activity.created_by
                        ? activity.created_by
                        : "SmartCampusAI CRM"}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
