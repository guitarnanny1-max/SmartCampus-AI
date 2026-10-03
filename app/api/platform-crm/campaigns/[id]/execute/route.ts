import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePlatformAdmin } from "@/app/lib/platform-auth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function renderTemplate(
  template: string | null,
  lead: {
    campus_name: string;
    contact_name: string | null;
    email: string | null;
    mobile: string | null;
    whatsappNumber: string | null;
  }
) {
  if (!template) return "";

  return template
    .replace(/\{\{\s*campus_name\s*\}\}/gi, lead.campus_name)
    .replace(
      /\{\{\s*contact_name\s*\}\}/gi,
      lead.contact_name || ""
    )
    .replace(
      /\{\{\s*email\s*\}\}/gi,
      lead.email || ""
    )
    .replace(
      /\{\{\s*mobile\s*\}\}/gi,
      lead.mobile || ""
    )
    .replace(
      /\{\{\s*whatsappNumber\s*\}\}/gi,
      lead.whatsappNumber || ""
    );
}

function getChannelEligibility(
  channel: string,
  lead: {
    email: string | null;
    emailAllowed: boolean;
    whatsappNumber: string | null;
    whatsappAllowed: boolean;
    mobile: string | null;
    voiceAllowed: boolean;
  }
) {
  switch (channel.toUpperCase()) {
    case "EMAIL":
      return {
        eligible:
          Boolean(lead.email) &&
          lead.emailAllowed,
        recipient: lead.email,
      };

    case "WHATSAPP":
      return {
        eligible:
          Boolean(lead.whatsappNumber) &&
          lead.whatsappAllowed,
        recipient: lead.whatsappNumber,
      };

    case "VOICE":
      return {
        eligible:
          Boolean(lead.mobile) &&
          lead.voiceAllowed,
        recipient: lead.mobile,
      };

    default:
      return {
        eligible: false,
        recipient: null,
      };
  }
}

function addDays(date: Date, days: number) {
  return new Date(
    date.getTime() +
      days * 24 * 60 * 60 * 1000
  );
}

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  const user = await requirePlatformAdmin();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id: campaignId } = await context.params;

  try {
    const body = await request.json().catch(() => ({}));
    const mode =
      typeof body.mode === "string"
        ? body.mode.toUpperCase()
        : "";

    if (mode !== "DRY_RUN") {
      return NextResponse.json(
        {
          error:
            "Only DRY_RUN execution is currently available.",
        },
        { status: 400 }
      );
    }

    const campaign = await prisma.campaign.findUnique({
      where: {
        id: campaignId,
      },
      include: {
        steps: {
          orderBy: {
            stepOrder: "asc",
          },
        },
        leads: {
          where: {
            status: {
              in: ["ACTIVE", "WAITING"],
            },
          },
          include: {
            lead: {
              select: {
                id: true,
                campus_name: true,
                contact_name: true,
                email: true,
                mobile: true,
                whatsappNumber: true,
                emailAllowed: true,
                whatsappAllowed: true,
                voiceAllowed: true,
                optedOut: true,
              },
            },
          },
        },
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    if (campaign.status !== "DRAFT") {
      return NextResponse.json(
        {
          error:
            "Dry-run execution is currently restricted to DRAFT campaigns.",
        },
        { status: 400 }
      );
    }

    if (!campaign.steps.length) {
      return NextResponse.json(
        {
          error:
            "Campaign has no steps.",
        },
        { status: 400 }
      );
    }

    const results: Array<{
      leadId: string;
      campusName: string;
      step: number;
      channel: string;
      status: string;
      recipient: string | null;
      error?: string;
    }> = [];

    for (const campaignLead of campaign.leads) {
      const lead = campaignLead.lead;

      if (lead.optedOut) {
        await prisma.communicationLog.create({
          data: {
            leadId: lead.id,
            campaignId: campaign.id,
            campaignLeadId: campaignLead.id,
            channel: "SYSTEM",
            status: "SKIPPED",
            message: "Lead is opted out.",
            provider: "DRY_RUN",
            error: "Lead opted out",
          },
        });

        await prisma.campaignLead.update({
          where: {
            id: campaignLead.id,
          },
          data: {
            status: "STOPPED",
            stoppedAt: new Date(),
            stopReason: "Lead opted out",
          },
        });

        results.push({
          leadId: lead.id,
          campusName: lead.campus_name,
          step: campaignLead.currentStep + 1,
          channel: "SYSTEM",
          status: "SKIPPED",
          recipient: null,
          error: "Lead opted out",
        });

        continue;
      }

      const step =
        campaign.steps.find(
          (item) =>
            item.stepOrder ===
            campaignLead.currentStep + 1
        ) || null;

      if (!step) {
        await prisma.campaignLead.update({
          where: {
            id: campaignLead.id,
          },
          data: {
            status: "COMPLETED",
            completedAt:
              campaignLead.completedAt ||
              new Date(),
            nextActionAt: null,
          },
        });

        continue;
      }

      const eligibility =
        getChannelEligibility(
          step.channel,
          lead
        );

      const message = renderTemplate(
        step.messageTemplate,
        lead
      );

      if (!eligibility.eligible) {
        await prisma.communicationLog.create({
          data: {
            leadId: lead.id,
            campaignId: campaign.id,
            campaignStepId: step.id,
            campaignLeadId: campaignLead.id,
            channel: step.channel,
            status: "SKIPPED",
            recipient:
              eligibility.recipient,
            message,
            provider: "DRY_RUN",
            error:
              "Missing contact method or required consent",
          },
        });

        results.push({
          leadId: lead.id,
          campusName: lead.campus_name,
          step: step.stepOrder,
          channel: step.channel,
          status: "SKIPPED",
          recipient:
            eligibility.recipient,
          error:
            "Missing contact method or required consent",
        });

        continue;
      }

      const now = new Date();

      const nextStep =
        campaign.steps.find(
          (item) =>
            item.stepOrder ===
            step.stepOrder + 1
        ) || null;

      const nextActionAt = nextStep
        ? addDays(
            now,
            nextStep.delayDays
          )
        : null;

      const nextStatus = nextStep
        ? "WAITING"
        : "COMPLETED";

      await prisma.communicationLog.create({
        data: {
          leadId: lead.id,
          campaignId: campaign.id,
          campaignStepId: step.id,
          campaignLeadId: campaignLead.id,
          channel: step.channel,
          status: "DRY_RUN",
          recipient:
            eligibility.recipient,
          message,
          provider: "DRY_RUN",
          attemptedAt: now,
          completedAt: now,
        },
      });

      await prisma.campaignLead.update({
        where: {
          id: campaignLead.id,
        },
        data: {
          status: nextStatus,
          currentStep: step.stepOrder,
          startedAt:
            campaignLead.startedAt ||
            now,
          nextActionAt,
          completedAt: nextStep
            ? null
            : now,
        },
      });

      results.push({
        leadId: lead.id,
        campusName: lead.campus_name,
        step: step.stepOrder,
        channel: step.channel,
        status: "DRY_RUN",
        recipient:
          eligibility.recipient,
      });
    }

    const summary = {
      total: results.length,
      dryRun: results.filter(
        (item) =>
          item.status === "DRY_RUN"
      ).length,
      skipped: results.filter(
        (item) =>
          item.status === "SKIPPED"
      ).length,
    };

    return NextResponse.json({
      success: true,
      mode: "DRY_RUN",
      campaign: {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
      },
      summary,
      results,
    });
  } catch (error) {
    console.error(
      "Campaign dry-run failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to execute campaign dry-run",
      },
      { status: 500 }
    );
  }
}
