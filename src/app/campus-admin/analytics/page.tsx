export const revalidate = 0;
export const dynamic = 'force-dynamic';
"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  CalendarDays,
  Eye,
  TrendingUp,
  Users,
} from "lucide-react";

type AnalyticsSummary = {
  success: boolean;
  totalVisitors: number;
  todayVisitors: number;
  weekVisitors: number;
  monthVisitors: number;
};

type StatCardProps = {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
};

function StatCard({
  title,
  value,
  description,
  icon,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value.toLocaleString("en-IN")}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function WebsiteAnalyticsPage() {
  const [analytics, setAnalytics] =
    useState<AnalyticsSummary | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/analytics/summary",
          {
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Unable to load website analytics.",
          );
        }

        setAnalytics(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load website analytics.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Activity className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Website Analytics
              </h1>

              <p className="text-sm text-slate-500">
                Monitor visitors and website activity.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Visitors"
            value={analytics?.totalVisitors ?? 0}
            description="All recorded website visitors"
            icon={<Users className="h-5 w-5" />}
          />

          <StatCard
            title="Today"
            value={analytics?.todayVisitors ?? 0}
            description="Visitors recorded today"
            icon={<Eye className="h-5 w-5" />}
          />

          <StatCard
            title="This Week"
            value={analytics?.weekVisitors ?? 0}
            description="Visitors since Monday"
            icon={<TrendingUp className="h-5 w-5" />}
          />

          <StatCard
            title="This Month"
            value={analytics?.monthVisitors ?? 0}
            description="Visitors this month"
            icon={<CalendarDays className="h-5 w-5" />}
          />
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <Activity className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Visitor Tracking
              </h2>

              <p className="text-sm text-slate-500">
                Website visitor tracking is active.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-slate-50 p-5">
            <p className="text-sm text-slate-600">
              Visitors are counted once per visitor per day.
              Refreshing the same browser does not continuously
              increase the visitor count.
            </p>
          </div>
        </div>

        {loading && (
          <p className="mt-6 text-center text-sm text-slate-400">
            Loading analytics...
          </p>
        )}
      </div>
    </main>
  );
}
