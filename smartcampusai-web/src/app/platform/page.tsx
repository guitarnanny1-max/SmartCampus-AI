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
  total?: number;
  error?: string;
};

export default function PlatformDashboard() {
  const [totalSchools, setTotalSchools] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/platform/schools", { cache: "no-store" })
      .then(async (response) => {
        const data: SchoolsResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load schools.");
        }

        setTotalSchools(data.total ?? data.schools?.length ?? 0);
      })
      .catch(() => {
        setTotalSchools(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const metrics = [
    ["Total Schools", loading ? "…" : String(totalSchools ?? "—")],
    ["Active Schools", "—"],
    ["Total Students", "—"],
    ["MRR", "—"],
  ];

  const management = [
    ["Schools", "/platform/schools"],
    ["Subscriptions", "/platform/subscriptions"],
    ["Plans & Pricing", "/platform/plans"],
    ["Billing", "/platform/billing"],
    ["Announcements", "/platform/announcements"],
    ["Platform Users", "/platform/users"],
    ["Audit Logs", "/platform/audit-logs"],
    ["Platform Settings", "/platform/settings"],
  ];

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-violet-400">
            SmartCampusAI Platform Control Center
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Super Admin Dashboard
          </h1>

          <p className="mt-2 text-slate-400">
            Manage schools, subscriptions, billing, users, announcements and
            platform operations.
          </p>
        </div>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
            >
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-3 text-3xl font-semibold">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {management.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:border-violet-400/40 hover:bg-white/10"
            >
              <p className="font-medium">{label}</p>
              <p className="mt-1 text-sm text-slate-500">
                Platform management
              </p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
