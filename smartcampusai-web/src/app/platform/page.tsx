"use client";

import { useEffect, useState } from "react";

type AuthResponse = {
  authenticated?: boolean;
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
    platformRole?: string | null;
    isPlatformUser?: boolean | null;
  };
};

export default function PlatformDashboard() {
  const [auth, setAuth] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((response) => response.json())
      .then((data: AuthResponse) => setAuth(data))
      .catch(() => setAuth(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        Loading platform dashboard...
      </main>
    );
  }

  const isSuperAdmin =
    auth?.user?.isPlatformUser === true &&
    auth?.user?.platformRole === "SUPER_ADMIN";

  if (!isSuperAdmin) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-2xl font-semibold">Access denied</h1>
          <p className="mt-2 text-slate-400">
            This area is restricted to SmartCampusAI Super Administrators.
          </p>
        </div>
      </main>
    );
  }

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
          {[
            ["Total Schools", "—"],
            ["Active Schools", "—"],
            ["Total Students", "—"],
            ["MRR", "—"],
          ].map(([label, value]) => (
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
          {[
            "Schools",
            "Subscriptions",
            "Plans & Pricing",
            "Billing",
            "Announcements",
            "Platform Users",
            "Audit Logs",
            "Platform Settings",
          ].map((item) => (
            <button
              key={item}
              type="button"
              className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:border-violet-400/40 hover:bg-white/10"
            >
              <p className="font-medium">{item}</p>
              <p className="mt-1 text-sm text-slate-500">
                Platform management
              </p>
            </button>
          ))}
        </section>
      </div>
    </main>
  );
}
