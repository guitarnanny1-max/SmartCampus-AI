"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type CreateSchoolResponse = {
  success?: boolean;
  error?: string;
  onboarding?: {
    status?: string;
    tenantId?: string;
    schoolId?: string;
    subdomain?: string;
    plan?: string;
  };
  admin?: {
    id?: string;
    email?: string;
    name?: string;
    role?: string;
  };
};

export default function AddSchoolPage() {
  const [name, setName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [plan, setPlan] = useState("STARTER");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CreateSchoolResponse | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/platform/schools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          subdomain,
          plan,
          adminName,
          adminEmail,
        }),
      });

      const data: CreateSchoolResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to create school.");
      }

      setResult(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Unable to create school.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (result?.success) {
    return (
      <main className="min-h-screen bg-slate-950 p-6 text-white md:p-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/platform/schools"
            className="text-sm font-medium text-violet-400 hover:text-violet-300"
          >
            ← Back to Schools
          </Link>

          <div className="mt-6 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-300">
              School Created
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              {name}
            </h1>

            <p className="mt-2 text-slate-300">
              The school tenant and initial administrator record were created
              successfully.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase text-slate-500">Tenant ID</p>
                <p className="mt-1 break-all font-mono text-sm">
                  {result.onboarding?.tenantId}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-slate-500">School ID</p>
                <p className="mt-1 break-all font-mono text-sm">
                  {result.onboarding?.schoolId}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-slate-500">Subdomain</p>
                <p className="mt-1 text-sm">
                  {result.onboarding?.subdomain}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-slate-500">Plan</p>
                <p className="mt-1 text-sm">
                  {result.onboarding?.plan}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-slate-500">
                  Administrator
                </p>
                <p className="mt-1 text-sm">
                  {result.admin?.name}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-slate-500">
                  Admin Email
                </p>
                <p className="mt-1 break-all text-sm">
                  {result.admin?.email}
                </p>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <Link
                href="/platform/schools"
                className="rounded-xl bg-violet-500 px-5 py-3 text-sm font-semibold transition hover:bg-violet-400"
              >
                View Schools
              </Link>

              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  setName("");
                  setSubdomain("");
                  setPlan("STARTER");
                  setAdminName("");
                  setAdminEmail("");
                }}
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/10"
              >
                Add Another School
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white md:p-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/platform/schools"
          className="text-sm font-medium text-violet-400 hover:text-violet-300"
        >
          ← Back to Schools
        </Link>

        <div className="mt-6">
          <p className="text-sm font-medium text-violet-400">
            Platform Control Center
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Add School
          </h1>

          <p className="mt-2 text-slate-400">
            Create a new SmartCampusAI school tenant and its initial
            administrator.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8"
        >
          {error && (
            <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="school-name"
              className="text-sm font-medium text-slate-200"
            >
              School name
            </label>
            <input
              id="school-name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Example International School"
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-violet-400"
            />
          </div>

          <div>
            <label
              htmlFor="subdomain"
              className="text-sm font-medium text-slate-200"
            >
              Subdomain
            </label>
            <input
              id="subdomain"
              value={subdomain}
              onChange={(event) => setSubdomain(event.target.value)}
              placeholder="example-school"
              pattern="[a-z0-9-]+"
              title="Use lowercase letters, numbers, and hyphens only."
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-violet-400"
            />
            <p className="mt-2 text-xs text-slate-500">
              Leave blank to generate one from the school name.
            </p>
          </div>

          <div>
            <label
              htmlFor="plan"
              className="text-sm font-medium text-slate-200"
            >
              Plan
            </label>
            <select
              id="plan"
              value={plan}
              onChange={(event) => setPlan(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-violet-400"
            >
              <option value="STARTER">STARTER</option>
              <option value="PROFESSIONAL">PROFESSIONAL</option>
              <option value="ENTERPRISE">ENTERPRISE</option>
            </select>
          </div>

          <div className="border-t border-white/10 pt-6">
            <h2 className="text-lg font-semibold">Initial Administrator</h2>
            <p className="mt-1 text-sm text-slate-500">
              This creates the application-level School Admin record.
            </p>
          </div>

          <div>
            <label
              htmlFor="admin-name"
              className="text-sm font-medium text-slate-200"
            >
              Administrator name
            </label>
            <input
              id="admin-name"
              value={adminName}
              onChange={(event) => setAdminName(event.target.value)}
              placeholder="School Administrator"
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-violet-400"
            />
          </div>

          <div>
            <label
              htmlFor="admin-email"
              className="text-sm font-medium text-slate-200"
            >
              Administrator email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={adminEmail}
              onChange={(event) => setAdminEmail(event.target.value)}
              placeholder="admin@example.com"
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-violet-400"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-violet-500 px-5 py-3 font-semibold transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Creating School..." : "Create School"}
          </button>
        </form>
      </div>
    </main>
  );
}
