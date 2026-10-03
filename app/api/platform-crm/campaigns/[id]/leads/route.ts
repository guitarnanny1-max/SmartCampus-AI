import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePlatformAdmin } from "@/app/lib/platform-auth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

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
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const leadIds = Array.isArray(body.leadIds)
      ? [
          ...new Set(
            body.leadIds.filter(
              (value: unknown): value is string =>
                typeof value === "string" &&
                value.trim().length > 0
            )
          ),
        ]
      : [];

    if (!leadIds.length) {
      return NextResponse.json(
        { error: "leadIds must contain at least one lead ID" },
        { status: 400 }
      );
    }

    const leads = await prisma.platform_crm_leads.findMany({
      where: {
        id: {
          in: leadIds,
        },
      },
      select: {
        id: true,
        optedOut: true,
        email: true,
        emailAllowed: true,
        whatsappNumber: true,
        whatsappAllowed: true,
        mobile: true,
        voiceAllowed: true,
      },
    });

    const requiredChannels = [
      ...new Set(
        campaign.steps.map((step) =>
          step.channel.toUpperCase()
        )
      ),
    ];

    const eligibleIds: string[] = [];
    const skipped: Array<{
      leadId: string;
      reason: string;
    }> = [];

    for (const lead of leads) {
      if (lead.optedOut) {
        skipped.push({
          leadId: lead.id,
          reason: "Lead is opted out",
        });
        continue;
      }

      const canUseEmail =
        Boolean(lead.email) && lead.emailAllowed;

      const canUseWhatsApp =
        Boolean(lead.whatsappNumber) &&
        lead.whatsappAllowed;

      const canUseVoice =
        Boolean(lead.mobile) && lead.voiceAllowed;

      const eligibleForAtLeastOneChannel =
        requiredChannels.some((channel) => {
          if (channel === "EMAIL") {
            return canUseEmail;
          }

          if (channel === "WHATSAPP") {
            return canUseWhatsApp;
          }

          if (channel === "VOICE") {
            return canUseVoice;
          }

          return false;
        });

      if (!eligibleForAtLeastOneChannel) {
        skipped.push({
          leadId: lead.id,
          reason:
            "No eligible contact channel or consent for this campaign",
        });
        continue;
      }

      eligibleIds.push(lead.id);
    }

    if (eligibleIds.length) {
      await prisma.$transaction(
        eligibleIds.map((leadId) =>
          prisma.campaignLead.upsert({
            where: {
              campaignId_leadId: {
                campaignId,
                leadId,
              },
            },
            update: {
              status: "ACTIVE",
              stopReason: null,
              stoppedAt: null,
            },
            create: {
              campaignId,
              leadId,
              status: "ACTIVE",
              currentStep: 0,
            },
          })
        )
      );
    }

    return NextResponse.json({
      success: true,
      campaignId,
      assignedCount: eligibleIds.length,
      skippedCount: skipped.length,
      skipped,
    });
  } catch (error) {
    console.error(
      "Failed to assign campaign leads:",
      error
    );

    return NextResponse.json(
      { error: "Failed to assign campaign leads" },
      { status: 500 }
    );
  }
}
