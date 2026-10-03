import type {
  CampaignMessageInput,
  CampaignProvider,
  ProviderResult,
} from "./types";

function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function normalizeWhatsAppRecipient(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    throw new Error("WhatsApp recipient number is invalid.");
  }

  return digits;
}

export class WhatsAppProvider implements CampaignProvider {
  readonly channel = "WHATSAPP" as const;

  async send(input: CampaignMessageInput): Promise<ProviderResult> {
    const apiVersion =
      process.env.WHATSAPP_GRAPH_API_VERSION?.trim() || "v25.0";

    const phoneNumberId = getRequiredEnv("WHATSAPP_PHONE_NUMBER_ID");
    const accessToken = getRequiredEnv("WHATSAPP_CLOUD_ACCESS_TOKEN");

    const recipient = normalizeWhatsAppRecipient(input.recipient);

    const url =
      `https://graph.facebook.com/${apiVersion}/` +
      `${encodeURIComponent(phoneNumberId)}/messages`;

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
            body: input.message,
          },
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        const metaError = payload?.error;

        const message =
          metaError?.message ||
          payload?.message ||
          `Meta WhatsApp API returned HTTP ${response.status}.`;

        return {
          success: false,
          mode: "LIVE",
          provider: "META_CLOUD_API",
          externalId: null,
          error: message,
        };
      }

      const externalId =
        payload?.messages?.[0]?.id ||
        null;

      if (!externalId) {
        return {
          success: false,
          mode: "LIVE",
          provider: "META_CLOUD_API",
          externalId: null,
          error: "Meta accepted the request but returned no message ID.",
        };
      }

      return {
        success: true,
        mode: "LIVE",
        provider: "META_CLOUD_API",
        externalId,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        mode: "LIVE",
        provider: "META_CLOUD_API",
        externalId: null,
        error:
          error instanceof Error
            ? error.message
            : "Unable to reach Meta WhatsApp Cloud API.",
      };
    }
  }
}
