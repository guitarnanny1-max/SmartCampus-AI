"use client";

import Link from "next/link";

export default function PlatformBillingPage() {
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
              Monitor platform billing, subscription revenue, and payment activity.
            </p>
          </div>
        </div>

        <section className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">Monthly Recurring Revenue</p>
            <p className="mt-3 text-3xl font-bold">₹0</p>
            <p className="mt-2 text-xs text-slate-500">
              Calculated from active subscriptions
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">Annual Recurring Revenue</p>
            <p className="mt-3 text-3xl font-bold">₹0</p>
            <p className="mt-2 text-xs text-slate-500">
              Annualized subscription value
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">Active Subscriptions</p>
            <p className="mt-3 text-3xl font-bold">0</p>
            <p className="mt-2 text-xs text-slate-500">
              Connected to platform subscriptions
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-lg font-semibold">Billing Operations</h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/platform/subscriptions"
              className="rounded-xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-violet-400/50 hover:bg-white/[0.06]"
            >
              <p className="font-semibold">Subscriptions</p>
              <p className="mt-1 text-sm text-slate-400">
                Manage school subscriptions
              </p>
            </Link>

            <Link
              href="/platform/plans"
              className="rounded-xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-violet-400/50 hover:bg-white/[0.06]"
            >
              <p className="font-semibold">Plans & Pricing</p>
              <p className="mt-1 text-sm text-slate-400">
                Configure platform pricing
              </p>
            </Link>

            <div className="rounded-xl border border-dashed border-white/10 p-5">
              <p className="font-semibold text-slate-300">Invoices</p>
              <p className="mt-1 text-sm text-slate-500">Coming next</p>
            </div>

            <div className="rounded-xl border border-dashed border-white/10 p-5">
              <p className="font-semibold text-slate-300">Payments</p>
              <p className="mt-1 text-sm text-slate-500">Coming next</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
