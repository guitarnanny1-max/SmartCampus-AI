export type CampaignChannel = "EMAIL" | "WHATSAPP" | "VOICE";

type LeadLike = {
  campus_name: string | null;
  contact_name: string | null;
  contact_role: string | null;
  email: string | null;
  mobile: string | null;
  whatsappNumber: string | null;
  city: string | null;
  state: string | null;
  website: string | null;
  emailAllowed: boolean;
  whatsappAllowed: boolean;
  voiceAllowed: boolean;
  optedOut: boolean;
};

export function renderCampaignTemplate(
  template: string | null | undefined,
  lead: LeadLike
) {
  if (!template) return "";

  const values: Record<string, string> = {
    campus_name: lead.campus_name ?? "",
    contact_name: lead.contact_name ?? "",
    contact_role: lead.contact_role ?? "",
    email: lead.email ?? "",
    mobile: lead.mobile ?? "",
    whatsappNumber: lead.whatsappNumber ?? "",
    city: lead.city ?? "",
    state: lead.state ?? "",
    website: lead.website ?? "",
  };

  return template.replace(
    /{{\s*([a-zA-Z0-9_]+)\s*}}/g,
    (_, key: string) => values[key] ?? ""
  );
}

export function isChannelEligible(
  channel: string,
  lead: LeadLike
) {
  if (lead.optedOut) return false;

  switch (channel as CampaignChannel) {
    case "EMAIL":
      return Boolean(lead.email && lead.emailAllowed);

    case "WHATSAPP":
      return Boolean(
        lead.whatsappNumber && lead.whatsappAllowed
      );

    case "VOICE":
      return Boolean(lead.mobile && lead.voiceAllowed);

    default:
      return false;
  }
}

export function resolveRecipient(
  channel: string,
  lead: LeadLike
) {
  switch (channel as CampaignChannel) {
    case "EMAIL":
      return lead.email;

    case "WHATSAPP":
      return lead.whatsappNumber;

    case "VOICE":
      return lead.mobile;

    default:
      return null;
  }
}

export function eligibilityReason(
  channel: string,
  lead: LeadLike
) {
  if (lead.optedOut) {
    return "Lead is opted out.";
  }

  switch (channel as CampaignChannel) {
    case "EMAIL":
      if (!lead.email) return "No email address.";
      if (!lead.emailAllowed) {
        return "Email permission is not enabled.";
      }
      return null;

    case "WHATSAPP":
      if (!lead.whatsappNumber) {
        return "No WhatsApp number.";
      }
      if (!lead.whatsappAllowed) {
        return "WhatsApp permission is not enabled.";
      }
      return null;

    case "VOICE":
      if (!lead.mobile) return "No mobile number.";
      if (!lead.voiceAllowed) {
        return "Voice permission is not enabled.";
      }
      return null;

    default:
      return "Unsupported campaign channel.";
  }
}
