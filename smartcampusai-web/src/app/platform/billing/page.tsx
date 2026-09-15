"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type BillingSubscription = {
  id: string;
  status: string;
  billingCycle: string;
  startedAt: string;
  currentPeriodEnd: string | null;
  Tenant:
    | {
        id: string;
        name: string;
        subdomain: string;
        plan: string;
      }
    | {
        id: string;
        name: string;
        subdomain: string;
        plan: string;
      }[]
    | null;
  PlatformPlan:
    | {
        id: string;
        name: string;
        monthlyPrice: number | null;
        annualPrice: number | null;
      }
    | {
        id: string;
        name: string;
        monthlyPrice: number | null;
        annualPrice: number | null;
      }[]
    | null;
};

type BillingData = {
  summary: {
    mrr: number;
    arr: number;
    activeSubscriptions: number;
    totalSubscriptions: number;
  };
  subscriptions: BillingSubscription[];
};

type CustomBill = {
  id: string;
  tenantId: string;
  description: string;
  amount: number;
  dueDate: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
  Tenant:
    | {
        id: string;
        name: string;
        subdomain: string;
      }
    | {
        id: string;
        name: string;
        subdomain: string;
      }[]
    | null;
};

function getTenant(
  tenant: BillingSubscription["Tenant"]
): NonNullable<BillingSubscription["Tenant"]> extends infer T
  ? T extends unknown[]
    ? T[number] | null
    : T
  : never {
  if (!tenant) return null;
  return Array.isArray(tenant) ? tenant[0] ?? null : tenant;
}

function getPlan(
  plan: BillingSubscription["PlatformPlan"]
) {
  if (!plan) return null;
  return Array.isArray(plan) ? plan[0] ?? null : plan;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function PlatformBillingPage() {
  const [data, setData] = useState<BillingData | null>(null);
  const [customBills, setCustomBills] = useState<CustomBill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showBillForm, setShowBillForm] = useState(false);
  const [billSubmitting, setBillSubmitting] = useState(false);
  const [billMessage, setBillMessage] = useState("");
  const [billForm, setBillForm] = useState({
    tenantId: "",
    description: "",
    amount: "",
    dueDate: "",
    notes: "",
  });

  useEffect(() => {
    let cancelled = false;

    async function loadBilling() {
      try {
        setLoading(true);
        setError("");

        const [billingResponse, customBillsResponse] = await Promise.all([
          fetch("/api/platform/billing", {
            cache: "no-store",
          }),
          fetch("/api/platform/billing/custom", {
            cache: "no-store",
          }),
        ]);

        const result = await billingResponse.json();
        const customBillsResult = await customBillsResponse.json();

        if (!billingResponse.ok) {
          throw new Error(
            result.error || "Failed to load billing data"
          );
        }

        if (!customBillsResponse.ok) {
          throw new Error(
            customBillsResult.error || "Failed to load custom bills"
          );
        }

        if (!cancelled) {
          setData(result);
          setCustomBills(customBillsResult.bills ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load billing data"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    loadBilling();

    return () => {
      cancelled = true;
    };
  }, []);

  const summary = data?.summary;

  async function createCustomBill(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBillSubmitting(true);
    setBillMessage("");
    setError("");

    try {
      const response = await fetch("/api/platform/billing/custom", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tenantId: billForm.tenantId,
          description: billForm.description,
          amount: Number(billForm.amount),
          dueDate: billForm.dueDate || null,
          notes: billForm.notes || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create custom bill");
      }

      setBillMessage("Custom bill created successfully.");

      const refreshResponse = await fetch(
        "/api/platform/billing/custom",
        { cache: "no-store" }
      );
      const refreshResult = await refreshResponse.json();

      if (refreshResponse.ok) {
        setCustomBills(refreshResult.bills ?? []);
      }

      setBillForm({
        tenantId: "",
        description: "",
        amount: "",
        dueDate: "",
        notes: "",
      });
      setShowBillForm(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create custom bill"
      );
    } finally {
      setBillSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <Link
            href="/platform"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            ← Back to Platform Control Center
          </Link>

          <div className="mt-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
              Platform Control Center
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Billing
            </h1>
            <p className="mt-2 text-slate-400">
              Monitor platform billing, subscription revenue, and payment
              activity.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <section className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">
              Monthly Recurring Revenue
            </p>
            <p className="mt-3 text-3xl font-bold">
              {loading ? "…" : formatCurrency(summary?.mrr ?? 0)}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              From active and trialing subscriptions
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">
              Annual Recurring Revenue
            </p>
            <p className="mt-3 text-3xl font-bold">
              {loading ? "…" : formatCurrency(summary?.arr ?? 0)}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Annualized recurring subscription value
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">
              Active Subscriptions
            </p>
            <p className="mt-3 text-3xl font-bold">
              {loading ? "…" : summary?.activeSubscriptions ?? 0}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Active and trialing accounts
            </p>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
          <div className="border-b border-white/10 px-6 py-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">
                  Subscription Billing
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Current billing position by school.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/platform/subscriptions"
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                >
                  Manage Subscriptions
                </Link>

                <button
                  type="button"
                  onClick={() => setShowBillForm((value) => !value)}
                  className="rounded-lg bg-violet-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-400"
                >
                  {showBillForm ? "Cancel" : "+ Custom Bill"}
                </button>
              </div>
            </div>
          </div>

          {billMessage && (
            <div className="border-b border-white/10 bg-emerald-400/10 px-6 py-3 text-sm text-emerald-300">
              {billMessage}
            </div>
          )}

          {showBillForm && (
            <form
              onSubmit={createCustomBill}
              className="border-b border-white/10 bg-white/[0.02] p-6"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-300">
                    School
                  </span>
                  <select
                    required
                    value={billForm.tenantId}
                    onChange={(event) =>
                      setBillForm({
                        ...billForm,
                        tenantId: event.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-violet-400"
                  >
                    <option value="">Select school</option>
                    {(data?.subscriptions ?? []).map((subscription) => {
                      const tenant = getTenant(subscription.Tenant);

                      if (!tenant) return null;

                      return (
                        <option key={tenant.id} value={tenant.id}>
                          {tenant.name} ({tenant.subdomain})
                        </option>
                      );
                    })}
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-300">
                    Description
                  </span>
                  <input
                    required
                    value={billForm.description}
                    onChange={(event) =>
                      setBillForm({
                        ...billForm,
                        description: event.target.value,
                      })
                    }
                    placeholder="Additional service or charge"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-400"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-300">
                    Amount
                  </span>
                  <input
                    required
                    min="0"
                    step="0.01"
                    type="number"
                    value={billForm.amount}
                    onChange={(event) =>
                      setBillForm({
                        ...billForm,
                        amount: event.target.value,
                      })
                    }
                    placeholder="0"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-400"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-300">
                    Due Date
                  </span>
                  <input
                    type="date"
                    value={billForm.dueDate}
                    onChange={(event) =>
                      setBillForm({
                        ...billForm,
                        dueDate: event.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-violet-400"
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="text-sm font-medium text-slate-300">
                    Notes
                  </span>
                  <textarea
                    rows={3}
                    value={billForm.notes}
                    onChange={(event) =>
                      setBillForm({
                        ...billForm,
                        notes: event.target.value,
                      })
                    }
                    placeholder="Optional billing notes"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-400"
                  />
                </label>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="submit"
                  disabled={billSubmitting}
                  className="rounded-xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {billSubmitting ? "Creating…" : "Create Custom Bill"}
                </button>
              </div>
            </form>
          )}

          {loading ? (
            <div className="px-6 py-10 text-center text-sm text-slate-400">
              Loading billing data…
            </div>
          ) : data?.subscriptions.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">School</th>
                    <th className="px-6 py-4 font-medium">Plan</th>
                    <th className="px-6 py-4 font-medium">Billing</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Period End</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                  {data.subscriptions.map((subscription) => {
                    const tenant = getTenant(subscription.Tenant);
                    const plan = getPlan(subscription.PlatformPlan);

                    const amount =
                      subscription.billingCycle === "ANNUAL"
                        ? Number(plan?.annualPrice ?? 0)
                        : Number(plan?.monthlyPrice ?? 0);

                    return (
                      <tr
                        key={subscription.id}
                        className="transition hover:bg-white/[0.025]"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">
                            {tenant?.name ?? "Unknown School"}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            {tenant?.subdomain ?? "—"}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-slate-300">
                          {plan?.name ?? "—"}
                        </td>

                        <td className="px-6 py-4 text-slate-300">
                          {subscription.billingCycle}
                        </td>

                        <td className="px-6 py-4 font-medium text-white">
                          {formatCurrency(amount)}
                        </td>

                        <td className="px-6 py-4">
                          <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                            {subscription.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-slate-400">
                          {formatDate(subscription.currentPeriodEnd)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-10 text-center text-sm text-slate-400">
              No subscriptions found.
            </div>
          )}
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
            <div className="border-b border-white/10 px-6 py-5">
              <h2 className="text-lg font-semibold">Custom Bills</h2>
            <p className="mt-1 text-sm text-slate-400">
              One-time and additional charges issued to schools.
            </p>
          </div>

          {customBills.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">School</th>
                    <th className="px-6 py-4 font-medium">Description</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Due Date</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {customBills.map((bill) => {
                    const tenant = Array.isArray(bill.Tenant)
                      ? bill.Tenant[0] ?? null
                      : bill.Tenant;

                    return (
                      <tr
                        key={bill.id}
                        className="transition hover:bg-white/[0.025]"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">
                            {tenant?.name ?? "Unknown School"}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            {tenant?.subdomain ?? "—"}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-300">
                          {bill.description}
                        </td>
                        <td className="px-6 py-4 font-medium text-white">
                          {formatCurrency(Number(bill.amount))}
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          {formatDate(bill.dueDate)}
                        </td>
                        <td className="px-6 py-4">
                          <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                            {bill.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          {bill.notes || "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-10 text-center text-sm text-slate-400">
              No custom bills found.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
