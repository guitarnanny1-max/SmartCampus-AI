"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type CampaignLead = {
  id: string;
  status: string;
  currentStep: number;
  nextActionAt: string | null;
  completedAt: string | null;
  stoppedAt: string | null;
  stopReason: string | null;
  processingAt: string | null;
  processingExecutionId: string | null;
  lead: {
    campus_name: string;
    contact_name: string | null;
    email: string | null;
    mobile: string | null;
    whatsappNumber: string | null;
    optedOut: boolean;
  };
};

type Step = {
  id: string;
  stepOrder: number;
  channel: string;
  delayDays: number;
  subject: string | null;
  messageTemplate: string | null;
};

type Campaign = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  totalLeads: number;
  dueNow: number;
  waiting: number;
  processing: number;
  completed: number;
  stopped: number;
  nextActionAt: string | null;
  steps: Step[];
  leads: CampaignLead[];
};

type MonitorResponse = {
  success: boolean;
  serverNow: string;
  summary: {
    activeCampaigns: number;
    dueNow: number;
    waiting: number;
    processing: number;
    processedToday: number;
    skippedToday: number;
    nextAction: {
      campaignId: string;
      campaignName: string;
      nextActionAt: string;
    } | null;
  };
  campaigns: Campaign[];
  error?: string;
};

function formatDate(value: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

function formatStepState(
  campaign: Campaign,
  lead: CampaignLead,
  step: Step
): "DONE" | "DUE" | "WAITING" | "PENDING" | "STOPPED" {
  if (lead.status === "STOPPED" || lead.stoppedAt) return "STOPPED";

  if (lead.status === "COMPLETED") return "DONE";

  if (step.stepOrder <= lead.currentStep) return "DONE";

  if (step.stepOrder === lead.currentStep + 1) {
    if (campaign.status !== "ACTIVE") return "PENDING";
    if (!lead.nextActionAt) return "DUE";
    return new Date(lead.nextActionAt) <= new Date() ? "DUE" : "WAITING";
  }

  return "PENDING";
}

export default function SchedulerMonitorPage() {
  const [data, setData] = useState<MonitorResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [recoveryBusy, setRecoveryBusy] = useState<string | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    setError("");
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await fetch(
        "/api/platform-crm/campaigns/monitor",
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      const payload = (await response.json()) as MonitorResponse;

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || "Failed to load scheduler monitor.");
      }

      setData(payload);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load scheduler monitor."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const interval = window.setInterval(() => void load(true), 30000);
    return () => window.clearInterval(interval);
  }, [load]);

  const activeCampaigns = useMemo(
    () => (data?.campaigns ?? []).filter((campaign) => campaign.status === "ACTIVE"),
    [data]
  );

  if (loading && !data) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-7xl">Loading scheduler monitor…</div>
      </main>
    );
  }

  if (error && !data) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-red-200">
            {error}
          </p>
        </div>
      </main>
    );
  }

  if (!data) return null;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-400">
              thomasG technologies • Campaign Operations
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Scheduler Monitor
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Read-only campaign state. Automatic refresh every 30 seconds.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/campaigns"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-900"
            >
              Campaign Builder
            </Link>
            <button
              type="button"
              onClick={() => void load(true)}
              disabled={refreshing}
              className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500 disabled:opacity-60"
            >
              {refreshing ? "Refreshing…" : "Refresh"}
            </button>
          </div>
        </header>

        {error ? (
          <p className="rounded-xl border border-amber-900 bg-amber-950/30 p-4 text-sm text-amber-200">
            {error}
          </p>
        ) : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Metric label="ACTIVE CAMPAIGNS" value={data.summary.activeCampaigns} />
          <Metric label="DUE NOW" value={data.summary.dueNow} />
          <Metric label="WAITING" value={data.summary.waiting} />
          <Metric label="PROCESSING" value={data.summary.processing} />
          <Metric label="PROCESSED TODAY" value={data.summary.processedToday} />
          <Metric label="SKIPPED TODAY" value={data.summary.skippedToday} />
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Next Scheduler Action</h2>
              <p className="mt-1 text-sm text-slate-400">
                Earliest future action across ACTIVE campaigns.
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-cyan-300">
                {data.summary.nextAction?.campaignName || "Nothing scheduled"}
              </p>
              <p className="text-sm text-slate-300">
                {formatDate(data.summary.nextAction?.nextActionAt ?? null)}
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Active Campaigns</h2>
            <span className="text-xs text-slate-500">
              Server: {formatDate(data.serverNow)} IST
            </span>
          </div>

          {activeCampaigns.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center text-slate-400">
              No ACTIVE campaigns.
            </div>
          ) : (
            activeCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                recoveryBusy={recoveryBusy}
                setRecoveryBusy={setRecoveryBusy}
                onRecovered={() => void load(true)}
              />
            ))
          )}
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

function CampaignCard({
  campaign,
  recoveryBusy,
  setRecoveryBusy,
  onRecovered,
}: {
  campaign: Campaign;
  recoveryBusy: string | null;
  setRecoveryBusy: (value: string | null) => void;
  onRecovered: () => void;
}) {
  const processingLeads = campaign.leads.filter(
    (lead) => lead.status === "PROCESSING"
  );

  async function recover(
    campaignLeadId: string,
    action: "RETRY" | "COMPLETE"
  ) {
    const label =
      action === "RETRY"
        ? "release this lead for retry"
        : "mark this lead as completed";

    const confirmed = window.confirm(
      `This lead is PROCESSING and the provider result may be ambiguous.\n\n` +
        `Are you sure you want to ${label}?`
    );

    if (!confirmed) return;

    setRecoveryBusy(campaignLeadId);

    try {
      const response = await fetch("/api/platform-crm/campaigns/recovery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          campaignLeadId,
          action,
          confirmation: "CAMPAIGN_PROCESSING_RECOVERY",
        }),
      });

      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || "Recovery failed.");
      }

      onRecovered();
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : "Recovery failed."
      );
    } finally {
      setRecoveryBusy(null);
    }
  }

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-semibold">{campaign.name}</h3>
            <span className="rounded-full border border-emerald-800 bg-emerald-950/40 px-2.5 py-1 text-xs font-semibold text-emerald-300">
              {campaign.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            {campaign.steps.length} step(s) • {campaign.totalLeads} lead(s)
          </p>
        </div>

        <Link
          href={`/admin/campaigns/${campaign.id}/run`}
          className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800"
        >
          Open Execution
        </Link>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        <MiniStat label="DUE" value={campaign.dueNow} />
        <MiniStat label="WAITING" value={campaign.waiting} />
        <MiniStat label="PROCESSING" value={campaign.processing} />
        <MiniStat label="COMPLETED" value={campaign.completed} />
        <MiniStat label="STOPPED" value={campaign.stopped} />
      </div>

      {processingLeads.length > 0 ? (
        <div className="mt-5 space-y-3">
          <div className="rounded-xl border border-amber-700 bg-amber-950/30 p-4">
            <div className="flex items-start gap-3">
              <div className="text-xl">⚠️</div>
              <div>
                <h4 className="font-semibold text-amber-200">
                  PROCESSING — MANUAL REVIEW REQUIRED
                </h4>
                <p className="mt-1 text-xs leading-5 text-amber-300/80">
                  The provider call may already have occurred. Do not
                  automatically retry a PROCESSING lead.
                </p>
              </div>
            </div>
          </div>

          {processingLeads.map((lead) => (
            <ProcessingLeadCard
              key={lead.id}
              campaign={campaign}
              lead={lead}
              busy={recoveryBusy === lead.id}
              onRecover={recover}
            />
          ))}
        </div>
      ) : null}

      <div className="mt-5 space-y-3">
        {campaign.leads.map((lead) => (
          <LeadTimeline key={lead.id} campaign={campaign} lead={lead} />
        ))}
      </div>
    </article>
  );
}

function ProcessingLeadCard({
  campaign,
  lead,
  busy,
  onRecover,
}: {
  campaign: Campaign;
  lead: CampaignLead;
  busy: boolean;
  onRecover: (
    campaignLeadId: string,
    action: "RETRY" | "COMPLETE"
  ) => Promise<void>;
}) {
  const step =
    campaign.steps.find(
      (candidate) => candidate.stepOrder === lead.currentStep + 1
    ) ?? campaign.steps.find(
      (candidate) => candidate.stepOrder === lead.currentStep
    );

  return (
    <div className="rounded-xl border border-amber-800 bg-slate-950/80 p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-white">
            {lead.lead.campus_name}
          </p>
          <p className="text-sm text-slate-400">
            {lead.lead.contact_name || "No contact name"}
          </p>
        </div>

        <span className="rounded-full border border-amber-700 bg-amber-950/50 px-3 py-1 text-xs font-bold text-amber-300">
          PROCESSING
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Info label="CHANNEL">
          {step?.channel || "—"}
        </Info>

        <Info label="RECIPIENT">
          {lead.lead.whatsappNumber || lead.lead.mobile || "—"}
        </Info>

        <Info label="PROCESSING STARTED">
          {formatDate(lead.processingAt)}
        </Info>

        <Info label="EXECUTION ID">
          <span className="break-all">
            {lead.processingExecutionId || "—"}
          </span>
        </Info>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Link
          href={`/admin/leads/manage?id=${encodeURIComponent(lead.lead.id)}`}
          className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800"
        >
          Review History
        </Link>

        <button
          type="button"
          disabled={busy}
          onClick={() => void onRecover(lead.id, "RETRY")}
          className="rounded-lg border border-cyan-700 bg-cyan-950/40 px-3 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-900/50 disabled:opacity-50"
        >
          {busy ? "Working…" : "Mark Safe to Retry"}
        </button>

        <button
          type="button"
          disabled={busy}
          onClick={() => void onRecover(lead.id, "COMPLETE")}
          className="rounded-lg border border-emerald-700 bg-emerald-950/40 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/50 disabled:opacity-50"
        >
          {busy ? "Working…" : "Mark Completed"}
        </button>
      </div>
    </div>
  );
}

function Info({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-3">
      <p className="text-[10px] font-semibold tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-xs text-slate-200">{children}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3">
      <p className="text-[10px] font-semibold tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}

function LeadTimeline({
  campaign,
  lead,
}: {
  campaign: Campaign;
  lead: CampaignLead;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-100">
            {lead.lead.campus_name}
          </p>
          <p className="text-sm text-slate-400">
            {lead.lead.contact_name || "No contact name"}
          </p>
        </div>
        <div className="text-right text-xs text-slate-400">
          <p>{lead.status}</p>
          <p>Current step: {lead.currentStep || 0}</p>
          <p>Next: {formatDate(lead.nextActionAt)}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-3">
        {campaign.steps.map((step) => {
          const state = formatStepState(campaign, lead, step);
          return (
            <div
              key={step.id}
              className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-300">
                  Step {step.stepOrder}
                </span>
                <StateBadge state={state} />
              </div>
              <p className="mt-2 text-xs font-semibold text-cyan-300">
                {step.channel}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Delay {step.delayDays} day(s)
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StateBadge({
  state,
}: {
  state: "DONE" | "DUE" | "WAITING" | "PENDING" | "STOPPED";
}) {
  const classes = {
    DONE: "border-emerald-800 bg-emerald-950/40 text-emerald-300",
    DUE: "border-cyan-800 bg-cyan-950/40 text-cyan-300",
    WAITING: "border-amber-800 bg-amber-950/40 text-amber-300",
    PENDING: "border-slate-700 bg-slate-900 text-slate-400",
    STOPPED: "border-red-800 bg-red-950/40 text-red-300",
  } as const;

  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${classes[state]}`}>
      {state}
    </span>
  );
}
