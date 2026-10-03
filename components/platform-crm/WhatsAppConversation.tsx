"use client";

import { useEffect, useState } from "react";

type WhatsAppMessage = {
  id: string;
  direction: "INBOUND" | "OUTBOUND" | string;
  status: string;
  recipient: string | null;
  message: string | null;
  provider: string | null;
  attemptedAt: string;
  completedAt: string | null;
  error: string | null;
  campaign?: {
    id: string;
    name: string;
  } | null;
  campaignStep?: {
    id: string;
    stepOrder: number;
    channel: string;
  } | null;
};

type ConversationResponse = {
  success: boolean;
  lead: {
    id: string;
    campus_name: string;
    contact_name: string | null;
    whatsappNumber: string | null;
    whatsappAllowed: boolean;
    optedOut: boolean;
  };
  messages: WhatsAppMessage[];
};

type Props = {
  leadId: string;
};

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function WhatsAppConversation({ leadId }: Props) {
  const [data, setData] = useState<ConversationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [sendSuccess, setSendSuccess] = useState("");

  const [showLiveConfirm, setShowLiveConfirm] = useState(false);

  async function loadConversation() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/platform-crm/leads/${encodeURIComponent(leadId)}/whatsapp`,
        {
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error || "Unable to load WhatsApp conversation"
        );
      }

      setData(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load WhatsApp conversation"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadConversation();
  }, [leadId]);

  async function sendDryRunReply() {
    const trimmed = message.trim();

    if (!trimmed || !data) return;

    setSending(true);
    setSendError("");
    setSendSuccess("");

    try {
      const response = await fetch(
        `/api/platform-crm/leads/${encodeURIComponent(
          leadId
        )}/whatsapp/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: trimmed,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Unable to send WhatsApp reply");
      }

      setMessage("");
      setSendSuccess("DRY_RUN reply recorded successfully.");

      await loadConversation();
    } catch (err) {
      setSendError(
        err instanceof Error
          ? err.message
          : "Unable to send WhatsApp reply"
      );
    } finally {
      setSending(false);
    }
  }

  async function sendLiveReply() {
    const trimmed = message.trim();

    if (!trimmed || !data) return;

    setShowLiveConfirm(false);
    setSending(true);
    setSendError("");
    setSendSuccess("");

    try {
      const response = await fetch(
        `/api/platform-crm/leads/${encodeURIComponent(
          leadId
        )}/whatsapp/live-reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: trimmed,
            confirmation: "LIVE_REPLY",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error || "Unable to send LIVE WhatsApp reply"
        );
      }

      setMessage("");
      setSendSuccess(
        `LIVE WhatsApp message sent successfully${
          result?.externalId ? ` • ${result.externalId}` : ""
        }`
      );

      await loadConversation();
    } catch (err) {
      setSendError(
        err instanceof Error
          ? err.message
          : "Unable to send LIVE WhatsApp reply"
      );
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          WhatsApp Conversation
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Loading conversation...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          WhatsApp Conversation
        </h2>

        <p className="mt-2 text-sm text-red-600">{error}</p>

        <button
          type="button"
          onClick={loadConversation}
          className="mt-4 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Retry
        </button>
      </section>
    );
  }

  if (!data) return null;

  const { lead, messages } = data;

  const canReply =
    Boolean(lead.whatsappNumber) &&
    lead.whatsappAllowed &&
    !lead.optedOut;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              WhatsApp Conversation
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {lead.contact_name || lead.campus_name}
              {lead.whatsappNumber ? ` • ${lead.whatsappNumber}` : ""}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span
              className={`rounded-full px-2.5 py-1 font-medium ${
                lead.whatsappAllowed
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {lead.whatsappAllowed
                ? "WhatsApp Allowed"
                : "WhatsApp Not Allowed"}
            </span>

            {lead.optedOut && (
              <span className="rounded-full bg-red-50 px-2.5 py-1 font-medium text-red-700">
                Opted Out
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-h-[620px] space-y-4 overflow-y-auto bg-slate-50/70 p-6">
        {messages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <p className="text-sm font-medium text-slate-700">
              No WhatsApp messages yet
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Inbound and outbound WhatsApp activity will appear here.
            </p>
          </div>
        ) : (
          messages.map((item) => {
            const inbound = item.direction === "INBOUND";

            return (
              <div
                key={item.id}
                className={`flex ${
                  inbound ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl border px-4 py-3 shadow-sm ${
                    inbound
                      ? "border-slate-200 bg-white"
                      : "border-blue-200 bg-blue-50"
                  }`}
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px]">
                    <span
                      className={`font-semibold ${
                        inbound ? "text-slate-700" : "text-blue-700"
                      }`}
                    >
                      {inbound ? "Inbound" : "Outbound"}
                    </span>

                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
                      {item.status === "DRY_RUN" ? "DRY_RUN" : item.status}
                    </span>

                    {item.provider && item.provider !== item.status && (
                      <span className="text-slate-400">
                        Provider: {item.provider}
                      </span>
                    )}

                    {!inbound && !item.campaign && (
                      <span className="rounded-full bg-violet-50 px-2 py-0.5 font-medium text-violet-700">
                        CRM Reply
                      </span>
                    )}
                  </div>

                  <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-800">
                    {item.message || "[Non-text WhatsApp message]"}
                  </p>

                  <div className="mt-2 text-[11px] text-slate-400">
                    {formatDateTime(item.attemptedAt)}
                  </div>

                  {item.campaign ? (
                    <div className="mt-2 border-t border-slate-200 pt-2 text-[11px] text-slate-500">
                      Campaign: {item.campaign.name}
                      {item.campaignStep
                        ? ` • Step ${item.campaignStep.stepOrder}`
                        : ""}
                    </div>
                  ) : !inbound ? (
                    <div className="mt-2 border-t border-slate-200 pt-2 text-[11px] text-slate-500">
                      CRM Reply
                    </div>
                  ) : null}

                  {item.error && (
                    <div className="mt-2 text-[11px] text-red-600">
                      {item.error}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="border-t border-slate-200 px-6 py-5">
        <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold text-amber-800">
              Campaign scheduler: DRY_RUN
            </p>

            <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
              Campaigns will not send LIVE
            </span>
          </div>

          <p className="mt-1 text-xs leading-5 text-amber-700">
            Individual CRM replies can be sent LIVE after explicit confirmation.
          </p>
        </div>

        <textarea
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
            setSendError("");
            setSendSuccess("");
          }}
          disabled={!canReply || sending}
          maxLength={4096}
          rows={4}
          placeholder={
            canReply
              ? "Type a WhatsApp reply..."
              : "WhatsApp reply is unavailable for this lead."
          }
          className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
        />

        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400">
            {message.length}/4096 characters
          </span>

          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={sendDryRunReply}
              disabled={!canReply || !message.trim() || sending}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send DRY-RUN"}
            </button>

            <button
              type="button"
              onClick={() => {
                setSendError("");
                setSendSuccess("");
                setShowLiveConfirm(true);
              }}
              disabled={!canReply || !message.trim() || sending}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send LIVE
            </button>
          </div>
        </div>

        {sendSuccess && (
          <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700">
            {sendSuccess}
          </div>
        )}

        {sendError && (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
            {sendError}
          </div>
        )}

        <div className="mt-3 text-[11px] leading-5 text-slate-500">
          DRY-RUN records CRM activity without contacting WhatsApp.
          LIVE sends through Meta WhatsApp Cloud API and records the Meta
          message ID in the CRM timeline.
        </div>
      </div>

      {showLiveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="live-whatsapp-confirm-title"
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
          >
            <h3
              id="live-whatsapp-confirm-title"
              className="text-lg font-semibold text-slate-900"
            >
              Send LIVE WhatsApp message?
            </h3>

            <div className="mt-4 rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Recipient
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-900">
                {lead.whatsappNumber}
              </p>
            </div>

            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-xs font-semibold text-amber-800">
                This is a real WhatsApp message.
              </p>

              <p className="mt-1 whitespace-pre-wrap break-words text-sm text-amber-900">
                {message.trim()}
              </p>
            </div>

            <p className="mt-3 text-xs leading-5 text-slate-500">
              The campaign scheduler remains in DRY_RUN. Only this individual
              CRM reply will be sent LIVE through Meta.
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowLiveConfirm(false)}
                disabled={sending}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={sendLiveReply}
                disabled={sending}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {sending ? "Sending..." : "Confirm & Send LIVE"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
