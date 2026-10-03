"use client";

import { use, useEffect, useState } from "react";

type Result = {
  leadId: string;
  campusName?: string;
  step?: number;
  channel: string;
  status: string;
  recipient?: string | null;
  message?: string;
  provider?: string;
  externalId?: string | null;
  error?: string | null;
};

type LivePreview = {
  campaignLeadId: string;
  leadId: string;
  campusName: string;
  contactName: string | null;
  channel: string;
  recipient: string | null;
  subject: string | null;
  message: string;
  currentStep: number;
};

type LivePreviewResponse = {
  success: boolean;
  mode: string;
  campaign: {
    id: string;
    name: string;
    status: string;
    stepCount: number;
  };
  summary: {
    eligible: number;
    blocked: number;
    totalConsidered: number;
    channels: {
      EMAIL: number;
      WHATSAPP: number;
      VOICE: number;
    };
  };
  previews: LivePreview[];
  blocked: Array<{
    campaignLeadId: string;
    leadId: string;
    campusName: string;
    currentStep: number;
    channel: string;
    reason: string;
  }>;
  executionAllowed: boolean;
  providerMode: string;
};

type Campaign = {
  id: string;
  name: string;
  status: string;
  steps: Array<{
    id: string;
    stepOrder: number;
    channel: string;
    delayDays: number;
    messageTemplate: string | null;
  }>;
  leads: Array<{
    id: string;
    status: string;
    currentStep: number;
    lead: {
      campus_name: string;
      contact_name: string | null;
      whatsappNumber: string | null;
      email: string | null;
    };
  }>;
};

export default function CampaignRunPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [liveResults, setLiveResults] = useState<Result[]>([]);
  const [livePreview, setLivePreview] =
    useState<LivePreviewResponse | null>(null);

  const [running, setRunning] = useState(false);
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveExecuting, setLiveExecuting] = useState(false);

  const [showLiveConfirm, setShowLiveConfirm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadCampaign() {
    try {
      const response = await fetch(
        `/api/platform-crm/campaigns/${id}`,
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to load campaign."
        );
      }

      setCampaign(data.campaign);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load campaign."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCampaign();
  }, [id]);

  async function runDryTest() {
    if (!campaign || !id) return;

    setRunning(true);
    setError("");
    setMessage("");
    setResults([]);

    try {
      const isActive = campaign.status === "ACTIVE";

      const endpoint = isActive
        ? "/api/platform-crm/campaigns/process-due"
        : `/api/platform-crm/campaigns/${id}/execute`;

      const body = isActive
        ? {
            mode: "DRY_RUN",
            campaignId: id,
            limit: 25,
          }
        : {
            mode: "DRY_RUN",
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to run campaign dry test."
        );
      }

      if (Array.isArray(data?.results)) {
        setResults(data.results);
      }

      setMessage(
        isActive
          ? `${campaign.name}: ${data?.processed ?? 0} processed, ${data?.dueCount ?? 0} due.`
          : `Dry run complete: ${data?.processed ?? data?.results?.length ?? 0} processed, ${data?.skipped ?? 0} skipped.`
      );

      await loadCampaign();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to run campaign dry test."
      );
    } finally {
      setRunning(false);
    }
  }

  async function previewLive() {
    if (!campaign || campaign.status !== "ACTIVE") return;

    setLiveLoading(true);
    setError("");
    setMessage("");
    setLiveResults([]);

    try {
      const response = await fetch(
        `/api/platform-crm/campaigns/${id}/live-preview`,
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to generate LIVE preview."
        );
      }

      setLivePreview(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate LIVE preview."
      );
    } finally {
      setLiveLoading(false);
    }
  }

  async function executeLive() {
    setLiveExecuting(true);
    setShowLiveConfirm(false);
    setError("");
    setMessage("");
    setLiveResults([]);

    try {
      const response = await fetch(
        `/api/platform-crm/campaigns/${id}/live-execute`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            confirmation: "LIVE_CAMPAIGN_EXECUTE",
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.error || "LIVE campaign execution failed."
        );
      }

      if (Array.isArray(data?.results)) {
        setLiveResults(data.results);
      }

      setMessage(
        `LIVE execution complete: ${data?.summary?.sent ?? 0} sent, ${data?.summary?.failed ?? 0} failed, ${data?.summary?.skipped ?? 0} skipped.`
      );

      setLivePreview(null);

      await loadCampaign();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "LIVE campaign execution failed."
      );
    } finally {
      setLiveExecuting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-6 text-slate-100 md:p-10">
        <div className="mx-auto max-w-6xl py-16">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
            <div className="text-sm text-slate-400">
              Loading campaign...
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error && !campaign) {
    return (
      <main className="min-h-screen bg-slate-950 p-6 text-slate-100 md:p-10">
        <div className="mx-auto max-w-6xl py-16">
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8">
            <h1 className="text-xl font-bold text-red-300">
              Unable to load campaign
            </h1>

            <p className="mt-3 text-sm text-red-200">
              {error}
            </p>

            <a
              href="/admin/campaigns"
              className="mt-5 inline-block rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200"
            >
              Back to Campaigns
            </a>
          </div>
        </div>
      </main>
    );
  }

  if (!campaign) {
    return (
      <main className="min-h-screen bg-slate-950 p-6 text-slate-100 md:p-10">
        <div className="mx-auto max-w-6xl py-16">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-sm text-slate-400">
            Campaign not found.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100 md:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="border-b border-slate-800 pb-6">
          <div className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            thomasG technologies • Campaign Execution
          </div>

          <h1 className="mt-2 text-3xl font-black">
            {campaign.name}
          </h1>

          <div className="mt-2 text-sm text-slate-500">
            {campaign.status} • {campaign.steps.length} step(s) •{" "}
            {campaign.leads.length} lead(s)
          </div>
        </header>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
            {message}
          </div>
        )}

        <section className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
          <h2 className="text-lg font-bold">
            Safe Dry Run
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Creates CommunicationLog records with{" "}
            <strong className="text-amber-300">
              DRY_RUN
            </strong>{" "}
            status only. No email, WhatsApp or voice provider is called.
          </p>

          <button
            type="button"
            onClick={runDryTest}
            disabled={
              running ||
              campaign.status === "COMPLETED" ||
              campaign.status === "CANCELLED"
            }
            className="mt-5 rounded-xl bg-amber-500 px-5 py-3 font-semibold text-slate-950 disabled:opacity-50"
          >
            {running
              ? "Running Dry Test..."
              : campaign.status === "ACTIVE"
                ? "Run Scheduler Dry-Run"
                : "Run Dry Test"}
          </button>
        </section>

        {campaign.status === "ACTIVE" && (
          <section className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-red-400">
                  Controlled LIVE Execution
                </div>

                <h2 className="mt-2 text-xl font-bold">
                  LIVE Campaign Control
                </h2>

                <p className="mt-2 max-w-3xl text-sm text-slate-400">
                  Preview the exact recipients and rendered messages before
                  sending. LIVE execution requires an explicit confirmation
                  and uses the Meta WhatsApp Cloud API.
                </p>
              </div>

              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-300">
                Global scheduler: DRY_RUN
              </div>
            </div>

            <button
              type="button"
              onClick={previewLive}
              disabled={liveLoading || liveExecuting}
              className="mt-5 rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-3 font-semibold text-red-200 hover:bg-red-500/20 disabled:opacity-50"
            >
              {liveLoading
                ? "Generating LIVE Preview..."
                : "Preview LIVE Campaign"}
            </button>

            {livePreview && (
              <div className="mt-6 space-y-5">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                    <div className="text-xs uppercase text-slate-500">
                      Eligible
                    </div>
                    <div className="mt-1 text-2xl font-black text-emerald-400">
                      {livePreview.summary.eligible}
                    </div>
                  </div>

                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                    <div className="text-xs uppercase text-slate-500">
                      Blocked
                    </div>
                    <div className="mt-1 text-2xl font-black text-red-400">
                      {livePreview.summary.blocked}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <div className="text-xs uppercase text-slate-500">
                      WhatsApp
                    </div>
                    <div className="mt-1 text-2xl font-black">
                      {livePreview.summary.channels.WHATSAPP}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <div className="text-xs uppercase text-slate-500">
                      Provider Mode
                    </div>
                    <div className="mt-1 text-sm font-bold text-cyan-400">
                      {livePreview.providerMode}
                    </div>
                  </div>
                </div>

                {livePreview.previews.length > 0 && (
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <h3 className="font-bold">
                      Messages Ready for LIVE
                    </h3>

                    <div className="mt-4 space-y-3">
                      {livePreview.previews.map((item) => (
                        <div
                          key={item.campaignLeadId}
                          className="rounded-lg border border-slate-800 bg-slate-900 p-4"
                        >
                          <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                            <div className="font-semibold">
                              {item.campusName}
                              {item.contactName
                                ? ` • ${item.contactName}`
                                : ""}
                            </div>

                            <div className="text-xs text-cyan-400">
                              {item.channel} • {item.recipient}
                            </div>
                          </div>

                          <div className="mt-3 rounded-lg bg-slate-950 p-3 text-sm text-slate-300">
                            {item.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {livePreview.blocked.length > 0 && (
                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                    <h3 className="font-bold text-amber-300">
                      Blocked Leads
                    </h3>

                    <div className="mt-3 space-y-2 text-sm">
                      {livePreview.blocked.map((item) => (
                        <div
                          key={item.campaignLeadId}
                          className="flex flex-col gap-1 border-b border-slate-800 pb-2 last:border-0"
                        >
                          <span className="font-semibold">
                            {item.campusName}
                          </span>
                          <span className="text-slate-400">
                            {item.reason}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5">
                  <div className="font-bold text-red-300">
                    LIVE sending requires explicit authorization
                  </div>

                  <p className="mt-2 text-sm text-red-200/80">
                    {livePreview.executionAllowed
                      ? `${livePreview.summary.eligible} eligible message(s) are ready to be sent through Meta WhatsApp Cloud API.`
                      : "No eligible messages are currently available for LIVE execution."}
                  </p>

                  <button
                    type="button"
                    onClick={() => setShowLiveConfirm(true)}
                    disabled={
                      !livePreview.executionAllowed ||
                      liveExecuting
                    }
                    className="mt-4 rounded-xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-500 disabled:opacity-40"
                  >
                    Authorize & Send LIVE
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {showLiveConfirm && livePreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="w-full max-w-lg rounded-2xl border border-red-500/40 bg-slate-900 p-6 shadow-2xl">
              <div className="text-xs font-bold uppercase tracking-widest text-red-400">
                Final LIVE Confirmation
              </div>

              <h2 className="mt-2 text-2xl font-black">
                Send LIVE WhatsApp messages?
              </h2>

              <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm">
                <div className="font-bold text-red-300">
                  {livePreview.summary.eligible} message(s) will be sent.
                </div>

                <div className="mt-2 text-slate-400">
                  This action contacts real WhatsApp recipients through Meta
                  Cloud API and creates permanent CRM communication records.
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowLiveConfirm(false)}
                  disabled={liveExecuting}
                  className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={executeLive}
                  disabled={liveExecuting}
                  className="rounded-xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-500 disabled:opacity-50"
                >
                  {liveExecuting
                    ? "Sending LIVE..."
                    : "Confirm LIVE Send"}
                </button>
              </div>
            </div>
          </div>
        )}

        {results.length > 0 && (
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-lg font-bold">
              Dry Run Results
            </h2>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="border-b border-slate-800 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">School</th>
                    <th className="px-4 py-3">Step</th>
                    <th className="px-4 py-3">Channel</th>
                    <th className="px-4 py-3">Recipient</th>
                    <th className="px-4 py-3">Result</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {results.map((result, index) => (
                    <tr key={`${result.leadId}-${index}`}>
                      <td className="px-4 py-3 font-semibold">
                        {result.campusName}
                      </td>

                      <td className="px-4 py-3">
                        {result.step}
                      </td>

                      <td className="px-4 py-3">
                        {result.channel}
                      </td>

                      <td className="px-4 py-3 text-slate-400">
                        {result.recipient || "—"}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={
                            result.status === "DRY_RUN"
                              ? "text-emerald-400"
                              : "text-amber-400"
                          }
                        >
                          {result.status}
                        </span>

                        {result.error && (
                          <div className="mt-1 text-xs text-red-400">
                            {result.error}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {liveResults.length > 0 && (
          <section className="rounded-2xl border border-red-500/20 bg-slate-900 p-6">
            <div className="text-xs font-bold uppercase tracking-widest text-red-400">
              LIVE Execution Results
            </div>

            <h2 className="mt-1 text-lg font-bold">
              Meta WhatsApp Cloud API
            </h2>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b border-slate-800 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">School</th>
                    <th className="px-4 py-3">Channel</th>
                    <th className="px-4 py-3">Recipient</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Provider ID</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {liveResults.map((result, index) => (
                    <tr key={`${result.leadId}-${index}`}>
                      <td className="px-4 py-3 font-semibold">
                        {result.campusName || "—"}
                      </td>

                      <td className="px-4 py-3">
                        {result.channel}
                      </td>

                      <td className="px-4 py-3 text-slate-400">
                        {result.recipient || "—"}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={
                            result.status === "SENT"
                              ? "font-semibold text-emerald-400"
                              : result.status === "FAILED"
                                ? "font-semibold text-red-400"
                                : "text-amber-400"
                          }
                        >
                          {result.status}
                        </span>

                        {result.error && (
                          <div className="mt-1 text-xs text-red-400">
                            {result.error}
                          </div>
                        )}
                      </td>

                      <td className="max-w-[320px] truncate px-4 py-3 text-xs text-slate-500">
                        {result.externalId || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-bold">
            Campaign Steps
          </h2>

          <div className="mt-4 space-y-3">
            {campaign.steps.map((step) => (
              <div
                key={step.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold">
                    Step {step.stepOrder} • {step.channel}
                  </div>

                  <div className="text-xs text-slate-500">
                    Delay: {step.delayDays} day(s)
                  </div>
                </div>

                <div className="mt-3 text-sm text-slate-400">
                  {step.messageTemplate || "No message template"}
                </div>
              </div>
            ))}
          </div>
        </section>

        <a
          href="/admin/campaigns"
          className="inline-block rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-900"
        >
          ← Back to Campaigns
        </a>
      </div>
    </main>
  );
}
