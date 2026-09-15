"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type PlatformSettings = {
  id: string;
  platformName: string;
  supportEmail: string | null;
  supportPhone: string | null;
  currency: string;
  timezone: string;
  maintenanceMode: boolean;
  schoolCreationEnabled: boolean;
};

export default function PlatformSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      try {
        const response = await fetch("/api/platform/settings", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load settings");
        }

        if (!cancelled) {
          setSettings(data.settings);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load settings",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!settings) return;

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/platform/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save settings");
      }

      setSettings(data.settings);
      setMessage("Platform settings saved successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save settings",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-slate-400">Loading platform settings…</p>
        </div>
      </main>
    );
  }

  if (!settings) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-red-400">
            {error || "Platform settings could not be loaded."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/platform"
              className="text-sm text-violet-400 hover:text-violet-300"
            >
              ← Platform Control Center
            </Link>

            <h1 className="mt-3 text-3xl font-bold tracking-tight">
              Platform Settings
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Configure global SmartCampusAI platform behavior.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-lg font-semibold">General</h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="text-sm text-slate-300">Platform Name</span>
                <input
                  value={settings.platformName}
                  onChange={(event) =>
                    setSettings({
                      ...settings,
                      platformName: event.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-violet-500"
                />
              </label>

              <label className="block">
                <span className="text-sm text-slate-300">Currency</span>
                <input
                  value={settings.currency}
                  maxLength={3}
                  onChange={(event) =>
                    setSettings({
                      ...settings,
                      currency: event.target.value.toUpperCase(),
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm uppercase outline-none focus:border-violet-500"
                />
              </label>

              <label className="block">
                <span className="text-sm text-slate-300">Support Email</span>
                <input
                  type="email"
                  value={settings.supportEmail ?? ""}
                  onChange={(event) =>
                    setSettings({
                      ...settings,
                      supportEmail: event.target.value || null,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-violet-500"
                  placeholder="support@example.com"
                />
              </label>

              <label className="block">
                <span className="text-sm text-slate-300">Support Phone</span>
                <input
                  value={settings.supportPhone ?? ""}
                  onChange={(event) =>
                    setSettings({
                      ...settings,
                      supportPhone: event.target.value || null,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-violet-500"
                  placeholder="+91 ..."
                />
              </label>

              <label className="block md:col-span-2">
                <span className="text-sm text-slate-300">Timezone</span>
                <input
                  value={settings.timezone}
                  onChange={(event) =>
                    setSettings({
                      ...settings,
                      timezone: event.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-violet-500"
                  placeholder="Asia/Kolkata"
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-lg font-semibold">Platform Controls</h2>

            <div className="mt-5 space-y-4">
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div>
                  <p className="font-medium">Maintenance Mode</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Mark the platform as undergoing maintenance.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(event) =>
                    setSettings({
                      ...settings,
                      maintenanceMode: event.target.checked,
                    })
                  }
                  className="h-5 w-5 accent-violet-600"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div>
                  <p className="font-medium">School Creation</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Allow platform administrators to create new schools.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={settings.schoolCreationEnabled}
                  onChange={(event) =>
                    setSettings({
                      ...settings,
                      schoolCreationEnabled: event.target.checked,
                    })
                  }
                  className="h-5 w-5 accent-violet-600"
                />
              </label>
            </div>
          </section>

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

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
