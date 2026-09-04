type LeadNotificationData = {
  schoolName: string;
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  studentCount?: number | null;
  source?: string | null;
  city?: string | null;
  state?: string | null;
  message?: string | null;
};

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export async function sendLeadNotification(
  lead: LeadNotificationData,
): Promise<{
  success: boolean;
  skipped?: boolean;
  messageId?: string;
  error?: string;
}> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  const recipient = normalizePhone(
    process.env.WHATSAPP_LEAD_NOTIFICATION_TO || "919160161600",
  );

  if (!accessToken || !phoneNumberId) {
    console.warn(
      "[WhatsApp] Notification skipped: WhatsApp credentials are not configured.",
    );

    return {
      success: false,
      skipped: true,
      error: "WhatsApp credentials are not configured.",
    };
  }

  const apiVersion = process.env.WHATSAPP_API_VERSION || "v23.0";

  const location =
    [lead.city, lead.state].filter(Boolean).join(", ") ||
    "Not provided";

  const studentCount =
    lead.studentCount !== null &&
    lead.studentCount !== undefined
      ? lead.studentCount.toLocaleString("en-IN")
      : "Not provided";

  const notificationText = [
    "🚨 New SmartCampusAI Lead",
    "",
    `🏫 School: ${lead.schoolName || "Not provided"}`,
    `👤 Contact: ${lead.contactName || "Not provided"}`,
    `📞 Phone: ${lead.contactPhone || "Not provided"}`,
    `📧 Email: ${lead.contactEmail || "Not provided"}`,
    `👨‍🎓 Students: ${studentCount}`,
    `📍 Location: ${location}`,
    `🌐 Source: ${lead.source || "website_demo_form"}`,
    "",
    `💬 Message: ${lead.message || "No message provided"}`,
  ].join("\n");

  const url =
    `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipient,
        type: "text",
        text: {
          preview_url: false,
          body: notificationText,
        },
      }),
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("[WhatsApp] API error:", result);

      return {
        success: false,
        error:
          result?.error?.message ||
          "WhatsApp API request failed.",
      };
    }

    const messageId = result?.messages?.[0]?.id;

    console.log(
      "[WhatsApp] Lead notification sent successfully:",
      messageId || "message accepted",
    );

    return {
      success: true,
      messageId,
    };
  } catch (error) {
    console.error("[WhatsApp] Notification failed:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown WhatsApp notification error.",
    };
  }
}
