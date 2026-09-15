"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type Announcement = {
  id: string;
  title: string;
  message: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "CRITICAL";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
  updatedAt: string;
};

const types = ["INFO", "SUCCESS", "WARNING", "CRITICAL"] as const;
const statuses = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

export default function PlatformAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [announcementMessage, setAnnouncementMessage] = useState("");
  const [type, setType] =
    useState<Announcement["type"]>("INFO");
  const [status, setStatus] =
    useState<Announcement["status"]>("DRAFT");

  async function loadAnnouncements() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/platform/announcements", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load announcements");
      }

      setAnnouncements(data.announcements ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load announcements",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function initialLoad() {
      try {
        const response = await fetch("/api/platform/announcements", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load announcements");
        }

        if (!cancelled) {
          setAnnouncements(data.announcements ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load announcements",
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

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setAnnouncementMessage("");
    setType("INFO");
    setStatus("DRAFT");
  }

  function editAnnouncement(announcement: Announcement) {
    setEditingId(announcement.id);
    setTitle(announcement.title);
    setAnnouncementMessage(announcement.message);
    setType(announcement.type);
    setStatus(announcement.status);
    setMessage("");
    setError("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/platform/announcements", {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(editingId ? { id: editingId } : {}),
          title,
          message: announcementMessage,
          type,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            `Failed to ${editingId ? "update" : "create"} announcement`,
        );
      }

      setMessage(
        editingId
          ? "Announcement updated successfully."
          : "Announcement created successfully.",
      );

      resetForm();
      await loadAnnouncements();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save announcement",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/platform"
              className="text-sm text-violet-400 hover:text-violet-300"
            >
              ← Platform Control Center
            </Link>

            <h1 className="mt-3 text-3xl font-bold tracking-tight">
              Announcements
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Create and manage announcements across the SmartCampusAI
              platform.
            </p>
          </div>

          <button
            type="button"
            onClick={loadAnnouncements}
            disabled={loading}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:border-violet-500 hover:text-white disabled:opacity-50"
          >
            Refresh
          </button>
        </div>

        <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">
              {editingId ? "Edit Announcement" : "Create Announcement"}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Publish important platform-wide information for schools and
              administrators.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="text-sm text-slate-300">Title</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Scheduled platform maintenance"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-violet-500"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-300">Message</span>
              <textarea
                value={announcementMessage}
                onChange={(event) =>
                  setAnnouncementMessage(event.target.value)
                }
                placeholder="Enter the announcement message..."
                rows={5}
                className="mt-2 w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-violet-500"
                required
              />
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="text-sm text-slate-300">Type</span>
                <select
                  value={type}
                  onChange={(event) =>
                    setType(event.target.value as Announcement["type"])
                  }
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-violet-500"
                >
                  {types.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm text-slate-300">Status</span>
                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value as Announcement["status"],
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-violet-500"
                >
                  {statuses.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {message && (
              <div className="rounded-xl border border-emerald-800 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-300">
                {message}
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 hover:border-slate-500 hover:text-white"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving…"
                  : editingId
                    ? "Update Announcement"
                    : "Create Announcement"}
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Platform Announcements
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {announcements.length} announcement
                {announcements.length === 1 ? "" : "s"} configured.
              </p>
            </div>
          </div>

          {loading ? (
            <p className="py-8 text-center text-sm text-slate-500">
              Loading announcements…
            </p>
          ) : announcements.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-700 px-6 py-12 text-center">
              <p className="text-sm text-slate-400">
                No announcements yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {announcements.map((announcement) => (
                <article
                  key={announcement.id}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">
                          {announcement.title}
                        </h3>

                        <span className="rounded-full border border-slate-700 px-2 py-1 text-xs text-slate-300">
                          {announcement.type}
                        </span>

                        <span className="rounded-full border border-violet-800 px-2 py-1 text-xs text-violet-300">
                          {announcement.status}
                        </span>
                      </div>

                      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-400">
                        {announcement.message}
                      </p>

                      <p className="mt-3 text-xs text-slate-600">
                        Created{" "}
                        {new Date(
                          announcement.createdAt,
                        ).toLocaleString()}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => editAnnouncement(announcement)}
                      className="shrink-0 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-violet-500 hover:text-white"
                    >
                      Edit
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
