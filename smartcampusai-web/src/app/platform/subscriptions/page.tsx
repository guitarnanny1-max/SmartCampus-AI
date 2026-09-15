"use client";

import { useEffect, useState } from "react";

type Subscription = {
  id: string;
  tenantId: string;
  planId: string;
  status: string;
  billingCycle: string;
  startedAt: string;
  currentPeriodStart: string;
  currentPeriodEnd: string | null;
  canceledAt: string | null;
  Tenant?: {
    id: string;
    name: string;
    subdomain: string;
    plan: string;
    status: string;
    paymentStatus: string;
    onboardingStatus: string;
  } | null;
  PlatformPlan?: {
    id: string;
    name: string;
    monthlyPrice: number | null;
    annualPrice: number | null;
  } | null;
};

export default function PlatformSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadSubscriptions() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/platform/subscriptions", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load subscriptions");
      }

      setSubscriptions(data.subscriptions ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load subscriptions",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function fetchSubscriptions() {
      try {
        const response = await fetch("/api/platform/subscriptions", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load subscriptions");
        }

        if (!cancelled) {
          setSubscriptions(data.subscriptions ?? []);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load subscriptions",
          );
          setLoading(false);
        }
      }
    }

    fetchSubscriptions();

    return () => {
      cancelled = true;
    };
  }, []);

  function formatDate(value: string | null) {
    if (!value) return "—";

    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatPrice(value: number | null) {
    if (value === null || value === undefined) return "—";

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-medium text-violet-400">
              Platform Control Center
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              Subscriptions
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Manage school subscriptions, billing cycles, and subscription
              status.
            </p>
          </div>

          <a
            href="/platform"
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
          >
            Back to Platform
          </a>
        </div>

        <section className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-400">Total Subscriptions</p>
            <p className="mt-2 text-2xl font-bold">
              {subscriptions.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-400">Active</p>
            <p className="mt-2 text-2xl font-bold">
              {
                subscriptions.filter(
                  (subscription) => subscription.status === "ACTIVE",
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-400">Past Due</p>
            <p className="mt-2 text-2xl font-bold">
              {
                subscriptions.filter(
                  (subscription) => subscription.status === "PAST_DUE",
                ).length
              }
            </p>
          </div>
        </section>

        {loading && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center text-sm text-slate-400">
            Loading subscriptions…
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-900/50 bg-red-950/30 p-6">
            <p className="text-sm text-red-300">{error}</p>
            <button
              type="button"
              onClick={loadSubscriptions}
              className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && subscriptions.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-10 text-center">
            <h2 className="text-lg font-semibold">No subscriptions yet</h2>
            <p className="mt-2 text-sm text-slate-400">
              Subscription records will appear here once schools are assigned
              a platform subscription.
            </p>
          </div>
        )}

        {!loading && !error && subscriptions.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b border-slate-800 bg-slate-900">
                  <tr>
                    <th className="px-5 py-4 font-medium text-slate-400">
                      School
                    </th>
                    <th className="px-5 py-4 font-medium text-slate-400">
                      Plan
                    </th>
                    <th className="px-5 py-4 font-medium text-slate-400">
                      Billing
                    </th>
                    <th className="px-5 py-4 font-medium text-slate-400">
                      Status
                    </th>
                    <th className="px-5 py-4 font-medium text-slate-400">
                      Started
                    </th>
                    <th className="px-5 py-4 font-medium text-slate-400">
                      Period End
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {subscriptions.map((subscription) => (
                    <tr
                      key={subscription.id}
                      className="transition hover:bg-slate-800/40"
                    >
                      <td className="px-5 py-4">
                        <div className="font-medium text-white">
                          {subscription.Tenant?.name ?? "Unknown school"}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {subscription.Tenant?.subdomain ?? "—"}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-medium text-white">
                          {subscription.PlatformPlan?.name ?? "—"}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {subscription.billingCycle === "ANNUAL"
                            ? formatPrice(
                                subscription.PlatformPlan?.annualPrice ?? null,
                              )
                            : formatPrice(
                                subscription.PlatformPlan?.monthlyPrice ?? null,
                              )}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-slate-300">
                        {subscription.billingCycle}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-200">
                          {subscription.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-slate-300">
                        {formatDate(subscription.startedAt)}
                      </td>

                      <td className="px-5 py-4 text-slate-300">
                        {formatDate(subscription.currentPeriodEnd)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
