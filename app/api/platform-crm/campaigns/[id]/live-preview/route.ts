import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePlatformAdmin } from "@/app/lib/platform-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isEligible(
  lead: {
    optedOut: boolean;
    email: string | null;
    emailAllowed: boolean;
    whatsappNumber: string | null;
    whatsappAllowed: boolean;
    mobile: string | null;
    voiceAllowed: boolean;
  },
  channel: string
) {
  if (lead.optedOut) return false;

  if (channel === "EMAIL") {
    return Boolean(lead.email && lead.emailAllowed);
  }

  if (channel === "WHATSAPP") {
    return Boolean(lead.whatsappNumber && lead.whatsappAllowed);
  }

  if (channel === "VOICE") {
    return Boolean(lead.mobile && lead.voiceAllowed);
  }

  return false;
}

function recipientFor(
  lead: {
    email: string | null;
    whatsappNumber: string | null;
    mobile: string | null;
  },
  channel: string
) {
  if (channel === "EMAIL") return lead.email;
  if (channel === "WHATSAPP") return lead.whatsappNumber;
  if (channel === "VOICE") return lead.mobile;
  return null;
}

function renderTemplate(
  template: string | null,
  lead: {
    campus_name: string;
    contact_name: string | null;
    contact_role: string | null;
    city: string | null;
    state: string | null;
  }
) {
  return (template || "")
    .replace(/\{\{\s*campus_name\s*\}\}/gi, lead.campus_name)
    .replace(/\{\{\s*contact_name\s*\}\}/gi, lead.contact_name || "")
    .replace(/\{\{\s*contact_role\s*\}\}/gi, lead.contact_role || "")
    .replace(/\{\{\s*city\s*\}\}/gi, lead.city || "")
    .replace(/\{\{\s*state\s*\}\}/gi, lead.state || "");
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePlatformAdmin();

    const { id } = await params;

    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        steps: {
          orderBy: { stepOrder: "asc" },
        },
        leads: {
          where: {
            status: {
              in: ["ACTIVE", "WAITING"],
            },
          },
          include: {
            lead: true,
          },
        },
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found." },
        { status: 404 }
      );
    }

    const channels = {
      EMAIL: 0,
      WHATSAPP: 0,
      VOICE: 0,
    };

    const previews: Array<{
      campaignLeadId: string;
      leadId: string;
      campusName: string;
      contactName: string | null;
      channel: string;
      recipient: string | null;
      subject: string | null;
      message: string;
      currentStep: number;
    }> = [];

    const blocked: Array<{
      campaignLeadId: string;
      leadId: string;
      campusName: string;
      currentStep: number;
      channel: string;
      reason: string;
    }> = [];

    for (const campaignLead of campaign.leads) {
      const step = campaign.steps[campaignLead.currentStep];

      if (!step) {
        continue;
      }

      const lead = campaignLead.lead;

      if (lead.optedOut) {
        blocked.push({
          campaignLeadId: campaignLead.id,
          leadId: lead.id,
          campusName: lead.campus_name,
          currentStep: campaignLead.currentStep,
          channel: step.channel,
          reason: "Lead has opted out.",
        });
        continue;
      }

      if (!isEligible(lead, step.channel)) {
        blocked.push({
          campaignLeadId: campaignLead.id,
          leadId: lead.id,
          campusName: lead.campus_name,
          currentStep: campaignLead.currentStep,
          channel: step.channel,
          reason: `Missing ${step.channel} permission or recipient.`,
        });
        continue;
      }

      const recipient = recipientFor(lead, step.channel);

      channels[step.channel as keyof typeof channels]++;

      previews.push({
        campaignLeadId: campaignLead.id,
        leadId: lead.id,
        campusName: lead.campus_name,
        contactName: lead.contact_name,
        channel: step.channel,
        recipient,
        subject: step.subject || null,
        message: renderTemplate(step.messageTemplate, lead),
        currentStep: campaignLead.currentStep,
      });
    }

    return NextResponse.json({
      success: true,
      mode: "LIVE_PREVIEW",
      campaign: {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        stepCount: campaign.steps.length,
      },
      summary: {
        eligible: previews.length,
        blocked: blocked.length,
        totalConsidered: previews.length + blocked.length,
        channels,
      },
      previews,
      blocked,
      executionAllowed:
        campaign.status === "ACTIVE" && previews.length > 0,
      providerMode:
        process.env.CAMPAIGN_PROVIDER_MODE?.trim() || "DRY_RUN",
    });
  } catch (error) {
    console.error("[Campaign LIVE Preview]", error);

    return NextResponse.json(
      { error: "Unable to generate campaign LIVE preview." },
      { status: 500 }
    );
  }
}
