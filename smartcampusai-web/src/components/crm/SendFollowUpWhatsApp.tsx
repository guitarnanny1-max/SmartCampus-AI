"use client";

import { useState } from "react";
import { Loader2, MessageCircle } from "lucide-react";

type SendFollowUpWhatsAppProps = {
  leadId: string;
  disabled?: boolean;
};

export default function SendFollowUpWhatsApp({
  leadId,
  disabled = false,
}: SendFollowUpWhatsAppProps) {
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function sendReminder() {
    setMessage("");
    setError("");

    if (!leadId) {
      setError("Lead ID is required.");
      return;
    }

    setSending(true);

    try {
      const response = await fetch(
        `/api/crm/leads/${leadId}/follow-up`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Unable to send WhatsApp follow-up reminder.",
        );
      }

      if (result?.skipped) {
        setMessage(
          result?.error ||
            "WhatsApp notification was skipped because it is not configured.",
        );
        return;
      }

      setMessage(
        result?.message ||
          "WhatsApp follow-up reminder sent successfully.",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to send WhatsApp follow-up reminder.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={sendReminder}
        disabled={disabled || sending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {sending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <MessageCircle className="h-4 w-4" />
        )}

        {sending
          ? "Sending WhatsApp..."
          : "Send WhatsApp Reminder"}
      </button>

      {message && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
          {message}
        </p>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
