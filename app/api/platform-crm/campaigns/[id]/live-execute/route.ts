import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePlatformAdmin } from "@/app/lib/platform-auth";
import { WhatsAppProvider } from "@/lib/campaign-providers/whatsapp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONFIRMATION = "LIVE_CAMPAIGN_EXECUTE";

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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePlatformAdmin();

    // Global campaign execution must remain DRY_RUN.
    // This endpoint is the only explicit LIVE campaign path.
    const providerMode =
      process.env.CAMPAIGN_PROVIDER_MODE?.trim() || "DRY_RUN";

    if (providerMode !== "DRY_RUN") {
      return NextResponse.json(
        {
          error:
            "LIVE campaign execution is blocked unless CAMPAIGN_PROVIDER_MODE is DRY_RUN.",
        },
        { status: 409 }
      );
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));

    if (String(body?.confirmation || "").trim() !== CONFIRMATION) {
      return NextResponse.json(
        {
          error: "Explicit LIVE campaign confirmation is required.",
          requiredConfirmation: CONFIRMATION,
        },
        { status: 400 }
      );
    }

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

    if (campaign.status !== "ACTIVE") {
      return NextResponse.json(
        {
          error: `Campaign must be ACTIVE for LIVE execution. Current status: ${campaign.status}.`,
        },
        { status: 409 }
      );
    }

    const whatsappProvider = new WhatsAppProvider();

    const results: Array<Record<string, unknown>> = [];

    for (const campaignLead of campaign.leads) {
      // Atomically claim the campaign lead before contacting Meta.
      // This prevents two concurrent LIVE requests from sending the
      // same campaign step twice.
      //
      // processingAt + processingExecutionId make an interrupted
      // provider call auditable without automatically retrying it.
      const processingExecutionId = crypto.randomUUID();
      const processingAt = new Date();

      const claim = await prisma.campaignLead.updateMany({
        where: {
          id: campaignLead.id,
          status: campaignLead.status,
        },
        data: {
          status: "PROCESSING",
          processingAt,
          processingExecutionId,
        },
      });

      if (claim.count !== 1) {
        results.push({
          campaignLeadId: campaignLead.id,
          leadId: campaignLead.leadId,
          status: "SKIPPED",
          reason:
            "Campaign lead was already claimed or processed by another execution.",
        });
        continue;
      }

      const step = campaign.steps[campaignLead.currentStep];

      if (!step) {
        await prisma.campaignLead.update({
          where: { id: campaignLead.id },
          data: {
            status: campaignLead.status,
            processingAt: null,
            processingExecutionId: null,
          },
        });

        results.push({
          campaignLeadId: campaignLead.id,
          leadId: campaignLead.leadId,
          status: "SKIPPED",
          reason: "No current campaign step.",
        });
        continue;
      }

      const lead = campaignLead.lead;

      if (lead.optedOut) {
        await prisma.campaignLead.update({
          where: { id: campaignLead.id },
          data: {
            status: campaignLead.status,
            processingAt: null,
            processingExecutionId: null,
          },
        });

        results.push({
          campaignLeadId: campaignLead.id,
          leadId: lead.id,
          status: "SKIPPED",
          reason: "Lead has opted out.",
        });
        continue;
      }

      if (step.channel !== "WHATSAPP") {
        await prisma.campaignLead.update({
          where: { id: campaignLead.id },
          data: {
            status: campaignLead.status,
            processingAt: null,
            processingExecutionId: null,
          },
        });

        results.push({
          campaignLeadId: campaignLead.id,
          leadId: lead.id,
          status: "SKIPPED",
          channel: step.channel,
          reason:
            "Controlled LIVE execution currently supports WHATSAPP only.",
        });
        continue;
      }

      if (!lead.whatsappAllowed || !lead.whatsappNumber) {
        await prisma.campaignLead.update({
          where: { id: campaignLead.id },
          data: {
            status: campaignLead.status,
            processingAt: null,
            processingExecutionId: null,
          },
        });

        results.push({
          campaignLeadId: campaignLead.id,
          leadId: lead.id,
          status: "SKIPPED",
          channel: "WHATSAPP",
          reason: "WhatsApp permission or recipient is missing.",
        });
        continue;
      }

      const message = renderTemplate(step.messageTemplate, lead);

      if (!message.trim()) {
        await prisma.campaignLead.update({
          where: { id: campaignLead.id },
          data: {
            status: campaignLead.status,
            processingAt: null,
            processingExecutionId: null,
          },
        });

        results.push({
          campaignLeadId: campaignLead.id,
          leadId: lead.id,
          status: "SKIPPED",
          channel: "WHATSAPP",
          reason: "Rendered message is empty.",
        });
        continue;
      }

      const attemptedAt = new Date();

      const providerResult = await whatsappProvider.send({
        channel: "WHATSAPP",
        recipient: lead.whatsappNumber,
        message,
        leadId: lead.id,
        campaignId: campaign.id,
        campaignStepId: step.id,
      });

      const completedAt = new Date();

      const communication = await prisma.communicationLog.create({
        data: {
          leadId: lead.id,
          campaignId: campaign.id,
          campaignStepId: step.id,
          campaignLeadId: campaignLead.id,
          channel: "WHATSAPP",
          direction: "OUTBOUND",
          status: providerResult.success ? "SENT" : "FAILED",
          recipient: lead.whatsappNumber,
          message,
          provider: providerResult.provider || "META_CLOUD_API",
          externalId: providerResult.externalId || null,
          attemptedAt,
          completedAt,
          error: providerResult.error || null,
        },
      });

      if (providerResult.success) {
        const nextStep = campaign.steps[campaignLead.currentStep + 1];

        if (nextStep) {
          const nextActionAt = new Date();
          nextActionAt.setDate(
            nextActionAt.getDate() + Math.max(0, nextStep.delayDays || 0)
          );

          await prisma.campaignLead.update({
            where: { id: campaignLead.id },
            data: {
              currentStep: campaignLead.currentStep + 1,
              status: "WAITING",
              nextActionAt,
              startedAt: campaignLead.startedAt || attemptedAt,
              processingAt: null,
              processingExecutionId: null,
            },
          });
        } else {
          await prisma.campaignLead.update({
            where: { id: campaignLead.id },
            data: {
              currentStep: campaignLead.currentStep + 1,
              status: "COMPLETED",
              completedAt: completedAt,
              nextActionAt: null,
              startedAt: campaignLead.startedAt || attemptedAt,
              processingAt: null,
              processingExecutionId: null,
            },
          });
        }
      }

      if (!providerResult.success) {
        await prisma.campaignLead.update({
          where: { id: campaignLead.id },
          data: {
            status: campaignLead.status,
            processingAt: null,
            processingExecutionId: null,
          },
        });
      }

      results.push({
        campaignLeadId: campaignLead.id,
        leadId: lead.id,
        campusName: lead.campus_name,
        channel: "WHATSAPP",
        recipient: lead.whatsappNumber,
        message,
        status: providerResult.success ? "SENT" : "FAILED",
        provider: providerResult.provider,
        externalId: providerResult.externalId || null,
        communicationId: communication.id,
        error: providerResult.error || null,
      });
    }

    const sent = results.filter((item) => item.status === "SENT").length;
    const failed = results.filter((item) => item.status === "FAILED").length;
    const skipped = results.filter((item) => item.status === "SKIPPED").length;

    return NextResponse.json({
      success: failed === 0,
      mode: "LIVE",
      provider: "META_CLOUD_API",
      campaign: {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
      },
      summary: {
        processed: results.length,
        sent,
        failed,
        skipped,
      },
      results,
    });
  } catch (error) {
    console.error("[Campaign LIVE Execute]", error);

    return NextResponse.json(
      { error: "Unable to execute LIVE campaign." },
      { status: 500 }
    );
  }
}
