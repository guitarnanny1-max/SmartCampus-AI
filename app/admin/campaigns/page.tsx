"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

const CHANNELS = [
  "EMAIL",
  "WHATSAPP",
  "VOICE",
] as const;

type Channel = (typeof CHANNELS)[number];

type Step = {
  channel: Channel;
  delayDays: number;
  subject: string;
  messageTemplate: string;
};

type Lead = {
  id: string;
  campus_name: string;
  contact_name: string | null;
  email: string | null;
  mobile: string | null;
  whatsappNumber: string | null;
  emailAllowed: boolean;
  whatsappAllowed: boolean;
  voiceAllowed: boolean;
  optedOut: boolean;
};

type Campaign = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  steps: Array<{
    id: string;
    stepOrder: number;
    channel: string;
    delayDays: number;
    subject: string | null;
    messageTemplate: string | null;
  }>;
  _count?: {
    leads: number;
    logs: number;
  };
};

function newStep(): Step {
  return {
    channel: "EMAIL",
    delayDays: 0,
    subject: "",
    messageTemplate: "",
  };
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] =
    useState<Campaign[]>([]);

  const [leads, setLeads] =
    useState<Lead[]>([]);

  const [selectedLeadIds, setSelectedLeadIds] =
    useState<string[]>([]);

  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");

  const [steps, setSteps] =
    useState<Step[]>([newStep()]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [aiWriterOpen, setAiWriterOpen] =
    useState<number | null>(null);

  const [aiPurpose, setAiPurpose] =
    useState("School demo invitation");

  const [aiAudience, setAiAudience] =
    useState("School Principal");

  const [aiTone, setAiTone] =
    useState("Professional, friendly and concise");

  const [aiLanguage, setAiLanguage] =
    useState("English");

  const [aiKeyPoints, setAiKeyPoints] =
    useState("");

  const [aiGenerating, setAiGenerating] =
    useState(false);

  async function loadCampaigns() {
    try {
      const response = await fetch(
        "/api/platform-crm/campaigns",
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            `Failed to load campaigns (HTTP ${response.status}).`
        );
      }

      setCampaigns(
        Array.isArray(data.campaigns)
          ? data.campaigns
          : []
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load campaigns."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadLeads() {
      try {
        const response = await fetch(
          "/api/platform-crm/leads",
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error ||
              `Failed to load CRM leads (HTTP ${response.status}).`
          );
        }

        if (!cancelled) {
          setLeads(
            Array.isArray(data.leads)
              ? data.leads
              : []
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load CRM leads."
          );
        }
      }
    }

    loadLeads();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const filteredLeads = useMemo(() => {
    const q = search
      .trim()
      .toLowerCase();

    if (!q) {
      return leads;
    }

    return leads.filter((lead) =>
      [
        lead.campus_name,
        lead.contact_name,
        lead.email,
        lead.mobile,
        lead.whatsappNumber,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(q)
        )
    );
  }, [leads, search]);

  async function generateAiMessage(index: number) {
    const step = steps[index];

    setAiGenerating(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        "/api/platform-crm/ai/message-writer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            channel: step.channel,
            purpose: aiPurpose,
            audience: aiAudience,
            tone: aiTone,
            language: aiLanguage,
            keyPoints: aiKeyPoints,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "Failed to generate AI message."
        );
      }

      updateStep(index, {
        subject:
          step.channel === "EMAIL"
            ? data.subject || step.subject
            : step.subject,
        messageTemplate: data.message || "",
      });

      setAiWriterOpen(null);
      setMessage(
        "AI draft generated. Review and edit it before saving the campaign."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate AI message."
      );
    } finally {
      setAiGenerating(false);
    }
  }

  function updateStep(
    index: number,
    patch: Partial<Step>
  ) {
    setSteps((current) =>
      current.map((step, i) =>
        i === index
          ? { ...step, ...patch }
          : step
      )
    );
  }

  function addStep() {
    setSteps((current) => [
      ...current,
      newStep(),
    ]);
  }

  function removeStep(index: number) {
    setSteps((current) =>
      current.length === 1
        ? current
        : current.filter(
            (_, i) => i !== index
          )
    );
  }

  function leadIsEligible(lead: Lead): boolean {
    if (lead.optedOut) {
      return false;
    }

    return steps.some((step) => {
      if (step.channel === "EMAIL") {
        return Boolean(lead.email) && lead.emailAllowed;
      }

      if (step.channel === "WHATSAPP") {
        return (
          Boolean(lead.whatsappNumber) &&
          lead.whatsappAllowed
        );
      }

      if (step.channel === "VOICE") {
        return Boolean(lead.mobile) && lead.voiceAllowed;
      }

      return false;
    });
  }

  function toggleLead(id: string) {
    const lead = leads.find((item) => item.id === id);

    if (!lead || !leadIsEligible(lead)) {
      return;
    }

    setSelectedLeadIds((current) =>
      current.includes(id)
        ? current.filter(
            (value) => value !== id
          )
        : [...current, id]
    );
  }

  async function saveCampaign(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      if (!name.trim()) {
        throw new Error(
          "Campaign name is required."
        );
      }

      const response = await fetch(
        "/api/platform-crm/campaigns",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: name.trim(),
            description:
              description.trim() || null,
            steps: steps.map((step) => ({
              channel: step.channel,
              delayDays:
                Number(step.delayDays) || 0,
              subject:
                step.subject.trim() ||
                null,
              messageTemplate:
                step.messageTemplate.trim(),
            })),
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.error ||
            "Failed to create campaign."
        );
      }

      let assignmentMessage =
        "No leads assigned.";

      if (selectedLeadIds.length > 0) {
        const assignResponse =
          await fetch(
            `/api/platform-crm/campaigns/${data.campaign.id}/leads`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                leadIds:
                  selectedLeadIds,
              }),
            }
          );

        const assignData =
          await assignResponse.json();

        if (
          !assignResponse.ok ||
          !assignData.success
        ) {
          throw new Error(
            assignData.error ||
              "Campaign created, but lead assignment failed."
          );
        }

        assignmentMessage =
          `${assignData.assignedCount} lead(s) assigned; ${assignData.skippedCount} skipped by consent/contact rules.`;
      }

      const refreshedCampaignsResponse = await fetch(
        "/api/platform-crm/campaigns",
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      const refreshedCampaignsData =
        await refreshedCampaignsResponse.json();

      if (
        refreshedCampaignsResponse.ok &&
        refreshedCampaignsData.success
      ) {
        setCampaigns(
          refreshedCampaignsData.campaigns || []
        );
      } else {
        setCampaigns((current) => [
          {
            ...data.campaign,
            _count: {
              leads:
                selectedLeadIds.length,
              logs: 0,
            },
          },
          ...current,
        ]);
      }

      setName("");
      setDescription("");
      setSteps([newStep()]);
      setSelectedLeadIds([]);

      setMessage(
        `Campaign saved as DRAFT. ${assignmentMessage}`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save campaign."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
        <div className="mx-auto max-w-7xl text-sm text-slate-400">
          Loading CRM campaigns...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100 md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="border-b border-slate-800 pb-6">
          <div className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            thomasG technologies • CRM Campaigns
          </div>

          <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight">
                Campaign Builder
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Build multi-step outreach campaigns and assign eligible CRM leads.
              </p>
            </div>

            <a
              href="/admin/leads"
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-900"
            >
              ← CRM Leads
            </a>
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

        <form
          onSubmit={saveCampaign}
          className="space-y-8"
        >
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-lg font-bold">
              1. Campaign
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <input
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Campaign name"
                required
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-cyan-500"
              />

              <input
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                placeholder="Description"
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-cyan-500"
              />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">
                  2. Campaign Steps
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Draft workflow only. No outbound messages are sent.
                </p>
              </div>

              <button
                type="button"
                onClick={addStep}
                className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300"
              >
                + Add Step
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {steps.map(
                (step, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-5"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="font-semibold">
                        Step {index + 1}
                      </div>

                      {steps.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeStep(
                              index
                            )
                          }
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <select
                        value={
                          step.channel
                        }
                        onChange={(event) =>
                          updateStep(
                            index,
                            {
                              channel:
                                event
                                  .target
                                  .value as Channel,
                            }
                          )
                        }
                        className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-500"
                      >
                        {CHANNELS.map(
                          (channel) => (
                            <option
                              key={channel}
                              value={channel}
                            >
                              {channel}
                            </option>
                          )
                        )}
                      </select>

                      <input
                        type="number"
                        min={0}
                        value={
                          step.delayDays
                        }
                        onChange={(event) =>
                          updateStep(
                            index,
                            {
                              delayDays:
                                Number(
                                  event
                                    .target
                                    .value
                                ),
                            }
                          )
                        }
                        placeholder="Delay days"
                        className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-500"
                      />

                      <input
                        value={
                          step.subject
                        }
                        onChange={(event) =>
                          updateStep(
                            index,
                            {
                              subject:
                                event
                                  .target
                                  .value,
                            }
                          )
                        }
                        placeholder={
                          step.channel ===
                          "EMAIL"
                            ? "Email subject"
                            : "Subject / label"
                        }
                        className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {step.channel === "VOICE"
                          ? "Voice call script"
                          : "Message template"}
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          setAiWriterOpen(
                            aiWriterOpen === index
                              ? null
                              : index
                          );
                        }}
                        className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20"
                      >
                        ✦ Write with AI
                      </button>
                    </div>

                    {aiWriterOpen === index && (
                      <div className="mt-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
                        <div className="mb-4">
                          <div className="text-sm font-bold text-cyan-300">
                            AI Message Writer
                          </div>

                          <p className="mt-1 text-xs text-slate-500">
                            Generate a draft for review. Nothing is sent automatically.
                          </p>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                          <select
                            value={aiPurpose}
                            onChange={(event) =>
                              setAiPurpose(event.target.value)
                            }
                            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                          >
                            <option>School demo invitation</option>
                            <option>Initial introduction</option>
                            <option>Follow-up after demo</option>
                            <option>Reminder</option>
                            <option>Product introduction</option>
                            <option>Re-engagement</option>
                          </select>

                          <select
                            value={aiAudience}
                            onChange={(event) =>
                              setAiAudience(event.target.value)
                            }
                            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                          >
                            <option>School Principal</option>
                            <option>School Correspondent</option>
                            <option>School Owner</option>
                            <option>Trustee</option>
                            <option>Administrative Head</option>
                            <option>School Director</option>
                          </select>

                          <select
                            value={aiTone}
                            onChange={(event) =>
                              setAiTone(event.target.value)
                            }
                            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                          >
                            <option>Professional, friendly and concise</option>
                            <option>Professional and formal</option>
                            <option>Friendly and conversational</option>
                            <option>Premium and executive</option>
                            <option>Short and direct</option>
                          </select>

                          <select
                            value={aiLanguage}
                            onChange={(event) =>
                              setAiLanguage(event.target.value)
                            }
                            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                          >
                            <option>English</option>
                            <option>Telugu</option>
                            <option>Hindi</option>
                          </select>
                        </div>

                        <textarea
                          value={aiKeyPoints}
                          onChange={(event) =>
                            setAiKeyPoints(event.target.value)
                          }
                          rows={3}
                          placeholder="Key points to include, e.g. AI-powered school ERP, admissions, fees, attendance, parent communication, demo invitation..."
                          className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm outline-none focus:border-cyan-500"
                        />

                        <div className="mt-3 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setAiWriterOpen(null)
                            }
                            className="rounded-xl border border-slate-700 px-4 py-2 text-xs text-slate-300 hover:bg-slate-900"
                          >
                            Cancel
                          </button>

                          <button
                            type="button"
                            disabled={aiGenerating}
                            onClick={() =>
                              generateAiMessage(index)
                            }
                            className="rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {aiGenerating
                              ? "Generating..."
                              : "Generate Draft"}
                          </button>
                        </div>
                      </div>
                    )}

                    <textarea
                      value={step.messageTemplate}
                      onChange={(event) =>
                        updateStep(index, {
                          messageTemplate:
                            event.target.value,
                        })
                      }
                      rows={6}
                      placeholder={
                        step.channel === "VOICE"
                          ? "Voice call script"
                          : "Message template"
                      }
                      className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-500"
                    />
                  </div>
                )
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-bold">
                  3. Select CRM Leads
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Server-side consent checks run again during assignment.
                </p>
              </div>

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search leads..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm md:w-80"
              />
            </div>

            <div className="mt-5 overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-slate-950 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Select</th>
                    <th className="px-4 py-3">School</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">WhatsApp</th>
                    <th className="px-4 py-3">Consent</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {filteredLeads.map(
                    (lead) => (
                      <tr
                        key={lead.id}
                        className="hover:bg-slate-950/60"
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedLeadIds.includes(
                              lead.id
                            )}
                            disabled={
                              !leadIsEligible(
                                lead
                              )
                            }
                            onChange={() =>
                              toggleLead(
                                lead.id
                              )
                            }
                          />
                        </td>

                        <td className="px-4 py-3 font-semibold">
                          {lead.campus_name}
                        </td>

                        <td className="px-4 py-3">
                          {lead.contact_name ||
                            "—"}
                        </td>

                        <td className="px-4 py-3 text-slate-400">
                          {lead.email || "—"}
                        </td>

                        <td className="px-4 py-3 text-slate-400">
                          {lead.whatsappNumber ||
                            "—"}
                        </td>

                        <td className="px-4 py-3">
                          {lead.optedOut ? (
                            <span className="text-red-400">
                              Opted out
                            </span>
                          ) : (
                            <div className="space-y-1">
                              <div className="flex flex-wrap gap-1 text-[10px]">
                                {lead.emailAllowed && lead.email && (
                                  <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-emerald-300">
                                    EMAIL
                                  </span>
                                )}

                                {lead.whatsappAllowed &&
                                  lead.whatsappNumber && (
                                    <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-cyan-300">
                                      WHATSAPP
                                    </span>
                                )}

                                {lead.voiceAllowed && lead.mobile && (
                                  <span className="rounded-full bg-violet-500/10 px-2 py-1 text-violet-300">
                                    VOICE
                                  </span>
                                )}

                                {!leadIsEligible(lead) && (
                                  <span className="text-amber-500">
                                    NO ELIGIBLE CHANNEL
                                  </span>
                                )}
                              </div>

                              {leadIsEligible(lead) && (
                                <span className="text-[10px] text-emerald-500">
                                  Eligible for this campaign
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  )}

                  {!filteredLeads.length && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-10 text-center text-slate-600"
                      >
                        No CRM leads found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-slate-500">
              {selectedLeadIds.length} lead(s) selected
            </div>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-cyan-600 px-6 py-3 font-semibold text-white hover:bg-cyan-500 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Draft & Assign Leads"}
            </button>
          </div>
        </form>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-bold">
            Existing Campaigns
          </h2>

          <div className="mt-4 space-y-3">
            {campaigns.length === 0 ? (
              <div className="text-sm text-slate-600">
                No campaigns yet.
              </div>
            ) : (
              campaigns.map(
                (campaign) => (
                  <div
                    key={campaign.id}
                    className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <div className="font-semibold">
                        {campaign.name}
                      </div>

                      <div className="mt-1 text-xs text-slate-500">
                        {
                          campaign.steps
                            .length
                        }{" "}
                        step(s) •{" "}
                        {campaign._count
                          ?.leads ??
                          0}{" "}
                        lead(s) •{" "}
                        {campaign.status}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-slate-600">
                        {campaign.status === "DRAFT"
                          ? "Draft only — no outbound sending"
                          : campaign.status === "ACTIVE"
                            ? "Campaign active — dry-run processing only"
                            : campaign.status === "PAUSED"
                              ? "Campaign paused"
                              : `Campaign ${campaign.status.toLowerCase()}`}
                      </span>

                      <a
                        href={`/admin/campaigns/${campaign.id}/run`}
                        className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800"
                      >
                        Open
                      </a>

                      {campaign.status === "DRAFT" && (
                        <button
                          type="button"
                          className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
                          onClick={async () => {
                            setError("");
                            setMessage("");

                            try {
                              const response = await fetch(
                                `/api/platform-crm/campaigns/${campaign.id}`,
                                {
                                  method: "PATCH",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    status: "ACTIVE",
                                  }),
                                }
                              );

                              const data = await response.json().catch(() => ({}));

                              if (!response.ok) {
                                throw new Error(
                                  data?.error || "Failed to activate campaign."
                                );
                              }

                              setMessage(`${campaign.name} activated.`);
                              await loadCampaigns();
                            } catch (error) {
                              setError(
                                error instanceof Error
                                  ? error.message
                                  : "Failed to activate campaign."
                              );
                            }
                          }}
                        >
                          Activate
                        </button>
                      )}

                      {campaign.status === "ACTIVE" && (
                        <>
                          <button
                            type="button"
                            className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800"
                            onClick={async () => {
                              setError("");
                              setMessage("");

                              try {
                                const response = await fetch(
                                  `/api/platform-crm/campaigns/${campaign.id}`,
                                  {
                                    method: "PATCH",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      status: "PAUSED",
                                    }),
                                  }
                                );

                                const data = await response.json().catch(() => ({}));

                                if (!response.ok) {
                                  throw new Error(
                                    data?.error || "Failed to pause campaign."
                                  );
                                }

                                setMessage(`${campaign.name} paused.`);
                                await loadCampaigns();
                              } catch (error) {
                                setError(
                                  error instanceof Error
                                    ? error.message
                                    : "Failed to pause campaign."
                                );
                              }
                            }}
                          >
                            Pause
                          </button>

                          <button
                            type="button"
                            className="rounded-lg bg-cyan-600 px-3 py-2 text-xs font-semibold text-white hover:bg-cyan-500"
                            onClick={async () => {
                              setError("");
                              setMessage("");

                              try {
                                const response = await fetch(
                                  "/api/platform-crm/campaigns/process-due",
                                  {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      mode: "DRY_RUN",
                                      campaignId: campaign.id,
                                      limit: 25,
                                    }),
                                  }
                                );

                                const data = await response.json().catch(() => ({}));

                                if (!response.ok) {
                                  throw new Error(
                                    data?.error ||
                                      "Failed to process due campaign steps."
                                  );
                                }

                                setMessage(
                                  `${campaign.name}: ${data?.processed ?? 0} processed, ${data?.skipped ?? 0} skipped.`
                                );


                              window.location.assign(
                                `/admin/campaigns/${campaign.id}/run`
                              );
} catch (error) {
                                setError(
                                  error instanceof Error
                                    ? error.message
                                    : "Failed to process due campaign steps."
                                );
                              }
                            }}
                          >
                            Run Due Dry-Run
                          </button>
                        </>
                      )}

                      {campaign.status === "PAUSED" && (
                        <button
                          type="button"
                          className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
                          onClick={async () => {
                            setError("");
                            setMessage("");

                            try {
                              const response = await fetch(
                                `/api/platform-crm/campaigns/${campaign.id}`,
                                {
                                  method: "PATCH",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    status: "ACTIVE",
                                  }),
                                }
                              );

                              const data = await response.json().catch(() => ({}));

                              if (!response.ok) {
                                throw new Error(
                                  data?.error || "Failed to resume campaign."
                                );
                              }

                              setMessage(`${campaign.name} resumed.`);
                              await loadCampaigns();
                            } catch (error) {
                              setError(
                                error instanceof Error
                                  ? error.message
                                  : "Failed to resume campaign."
                              );
                            }
                          }}
                        >
                          Resume
                        </button>
                      )}
                    </div>

                    {/* CAMPAIGN_ACTIONS_V3 */}
                  </div>
                )
              )
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
