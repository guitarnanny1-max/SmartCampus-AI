"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Plan = {
  id: string;
  name: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
};

type Subscription = {
  id: string;
  tenantId: string;
  planId: string;
  status: string;
  billingCycle: string;
  startedAt: string;
  currentPeriodEnd: string | null;
  Tenant?: {
    name: string;
    subdomain: string;
  } | null;
  PlatformPlan?: {
    name: string;
    monthlyPrice: number | null;
    annualPrice: number | null;
  } | null;
};

export default function ManageSubscriptionPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [subscription, setSubscription] =
    useState<Subscription | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const [planId, setPlanId] = useState("");
  const [billingCycle, setBillingCycle] = useState("MONTHLY");
  const [status, setStatus] = useState("ACTIVE");
  const [periodEnd, setPeriodEnd] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [subscriptionsResponse, plansResponse] =
          await Promise.all([
            fetch("/api/platform/subscriptions", {
              cache: "no-store",
            }),
            fetch("/api/platform/plans", {
              cache: "no-store",
            }),
          ]);

        const subscriptionsData = await subscriptionsResponse.json();
        const plansData = await plansResponse.json();

        if (!subscriptionsResponse.ok) {
          throw new Error(
            subscriptionsData.error ||
              "Failed to load subscription",
          );
        }

        if (!plansResponse.ok) {
          throw new Error(
            plansData.error || "Failed to load plans",
          );
        }

        const found = (subscriptionsData.subscriptions ?? []).find(
          (item: Subscription) => item.id === params.id,
        );

        if (!found) {
          throw new Error("Subscription not found");
        }

        if (!cancelled) {
          setSubscription(found);
          setPlans(plansData.plans ?? []);
          setPlanId(found.planId);
          setBillingCycle(found.billingCycle);
          setStatus(found.status);
          setPeriodEnd(
            found.currentPeriodEnd
              ? found.currentPeriodEnd.slice(0, 10)
              : "",
          );
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load subscription",
          );
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [params.id]);

  async function save() {
    try {
      setSaving(true);
      setSaved(false);
      setError("");

      const response = await fetch("/api/platform/subscriptions", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: params.id,
          planId,
          billingCycle,
          status,
          currentPeriodEnd: periodEnd || null,
          canceledAt:
            status === "CANCELED"
              ? new Date().toISOString()
              : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update subscription",
        );
      }

      setSubscription(data.subscription);
      setSaved(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update subscription",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-3xl text-center text-sm text-slate-400">
          Loading subscription…
        </div>
      </main>
    );
  }

  if (error && !subscription) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-900/50 bg-red-950/30 p-6">
          <p className="text-red-300">{error}</p>
        </div>
      </main>
    );
  }

  if (!subscription) return null;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => router.push("/platform/subscriptions")}
          className="mb-6 text-sm font-medium text-violet-300 hover:text-violet-200"
        >
          ← Back to Subscriptions
        </button>

        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-violet-400">
            Platform Control Center
          </p>
          <h1 className="text-3xl font-bold">
            Manage Subscription
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {subscription.Tenant?.name ?? "Unknown school"} ·{" "}
            {subscription.Tenant?.subdomain ?? "—"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="grid gap-5">
            <label className="text-sm">
              <span className="mb-2 block text-slate-400">
                Platform Plan
              </span>
              <select
                value={planId}
                onChange={(event) => setPlanId(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
              >
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm">
              <span className="mb-2 block text-slate-400">
                Billing Cycle
              </span>
              <select
                value={billingCycle}
                onChange={(event) =>
                  setBillingCycle(event.target.value)
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
              >
                <option value="MONTHLY">MONTHLY</option>
                <option value="ANNUAL">ANNUAL</option>
              </select>
            </label>

            <label className="text-sm">
              <span className="mb-2 block text-slate-400">
                Status
              </span>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
              >
                <option value="TRIALING">TRIALING</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="PAST_DUE">PAST DUE</option>
                <option value="CANCELED">CANCELED</option>
                <option value="EXPIRED">EXPIRED</option>
              </select>
            </label>

            <label className="text-sm">
              <span className="mb-2 block text-slate-400">
                Current Period End
              </span>
              <input
                type="date"
                value={periodEnd}
                onChange={(event) =>
                  setPeriodEnd(event.target.value)
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
              />
            </label>

            {error && (
              <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-4 text-sm text-red-300">
                {error}
              </div>
            )}

            {saved && (
              <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/30 p-4 text-sm text-emerald-300">
                Subscription updated successfully.
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() =>
                  router.push("/platform/subscriptions")
                }
                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="rounded-xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
