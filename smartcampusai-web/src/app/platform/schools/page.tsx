"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type School = {
  id: string;
  name: string;
  subdomain: string | null;
  plan: string | null;
};

type SchoolsResponse = {
  schools?: School[];
  error?: string;
};

export default function PlatformSchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/platform/schools", { cache: "no-store" })
      .then(async (response) => {
        const data: SchoolsResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load schools.");
        }

        setSchools(data.schools ?? []);
      })
      .catch((err: unknown) => {
        setError(
          err instanceof Error ? err.message : "Unable to load schools.",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Link
              href="/platform"
              className="text-sm font-medium text-violet-400 hover:text-violet-300"
            >
              ← Platform Control Center
            </Link>

            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              Schools
            </h1>

            <p className="mt-2 text-slate-400">
              Manage SmartCampusAI school tenants.
            </p>
          </div>


          <Link
            href="/platform/schools/new"
            className="inline-flex items-center justify-center rounded-xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400"
          >
            + Add School
          </Link>
        </div>

        {loading && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-400">
            Loading schools...
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-6 text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="border-b border-white/10 text-left text-sm text-slate-400">
                  <tr>
                    <th className="px-5 py-4">School</th>
                    <th className="px-5 py-4">Subdomain</th>
                    <th className="px-5 py-4">Plan</th>
                    <th className="px-5 py-4">Tenant ID</th>
                  </tr>
                </thead>

                <tbody>
                  {schools.map((school) => (
                    <tr
                      key={school.id}
                      className="border-b border-white/5 last:border-0"
                    >
                      <td className="px-5 py-4 font-medium">{school.name}</td>
                      <td className="px-5 py-4 text-slate-300">
                        {school.subdomain || "—"}
                      </td>
                      <td className="px-5 py-4 text-slate-300">
                        {school.plan || "—"}
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-slate-500">
                        {school.id}
                      </td>
                    </tr>
                  ))}

                  {schools.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-5 py-10 text-center text-slate-500"
                      >
                        No schools found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
