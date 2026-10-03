import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requirePlatformAdmin } from "@/app/lib/platform-auth";

import {
  eligibilityReason,
  isChannelEligible,
  renderCampaignTemplate,
  resolveRecipient,
} from "@/lib/campaign-engine";

import {
  dispatchCampaignMessage,
} from "@/lib/campaign-providers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_LIMIT = 100;

type RequestBody = {
  mode?: "DRY_RUN";
  campaignId?: string;
  limit?: number;
};

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export async function POST(request: Request) {
  try {
    const cronSecret = process.env.CRON_SECRET?.trim();
  const authorization = request.headers.get("authorization")?.trim() || "";
  const cronAuthorized =
    Boolean(cronSecret) &&
    authorization === `Bearer ${cronSecret}`;

  const user = cronAuthorized
    ? null
    : await requirePlatformAdmin();

    if (!user && !cronAuthorized) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = (await request.json().catch(() => ({}))) as RequestBody;

    const mode = body.mode ?? "DRY_RUN";

    if (mode !== "DRY_RUN") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Only DRY_RUN is enabled. No external provider is called.",
        },
        { status: 400 }
      );
    }

    const requestedLimit = Number(body.limit ?? 25);
    const limit = Math.min(
      Math.max(Number.isFinite(requestedLimit) ? requestedLimit : 25, 1),
      MAX_LIMIT
    );

    const now = new Date();

    const dueLeads = await prisma.campaignLead.findMany({
      where: {
        status: {
          in: ["ACTIVE", "WAITING"],
        },
        ...(body.campaignId
          ? { campaignId: body.campaignId }
          : {}),
        campaign: {
          status: "ACTIVE",
        },
        OR: [
          { nextActionAt: null },
          { nextActionAt: { lte: now } },
        ],
      },
      orderBy: {
        nextActionAt: "asc",
      },
      take: limit,
      include: {
        campaign: {
          include: {
            steps: {
              where: {
                status: "ACTIVE",
              },
              orderBy: {
                stepOrder: "asc",
              },
            },
          },
        },
        lead: {
          select: {
            id: true,
            campus_name: true,
            contact_name: true,
            contact_role: true,
            email: true,
            mobile: true,
            whatsappNumber: true,
            city: true,
            state: true,
            website: true,
            emailAllowed: true,
            whatsappAllowed: true,
            voiceAllowed: true,
            optedOut: true,
          },
        },
      },
    });

    const results: Array<{
      campaignLeadId: string;
      leadId: string;
      campusName: string | null;
      step: number;
      channel: string | null;
      recipient: string | null;
      status: string;
      message?: string | null;
      reason?: string | null;
    }> = [];

    for (const campaignLead of dueLeads) {
      const originalStatus = campaignLead.status;
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
          campusName: campaignLead.lead.campus_name,
          step: campaignLead.currentStep,
          channel: null,
          recipient: null,
          status: "SKIPPED",
          reason: "Campaign lead was already claimed or processed.",
        });

        continue;
      }

      const steps = campaignLead.campaign.steps;

      if (!steps.length) {
        await prisma.campaignLead.update({
          where: { id: campaignLead.id },
          data: {
            status: "COMPLETED",
            completedAt: now,
            nextActionAt: null,
            processingAt: null,
            processingExecutionId: null,
          },
        });

        results.push({
          campaignLeadId: campaignLead.id,
          leadId: campaignLead.leadId,
          campusName: campaignLead.lead.campus_name,
          step: campaignLead.currentStep,
          channel: null,
          recipient: null,
          status: "COMPLETED",
          reason: "Campaign has no active steps.",
        });

        continue;
      }

      if (campaignLead.lead.optedOut) {
        await prisma.communicationLog.create({
          data: {
            leadId: campaignLead.leadId,
            campaignId: campaignLead.campaignId,
            campaignLeadId: campaignLead.id,
            channel: "UNKNOWN",
            status: "SKIPPED",
            provider: "DRY_RUN",
            error: "Lead is opted out.",
          },
        });

        await prisma.campaignLead.update({
          where: { id: campaignLead.id },
          data: {
            status: "STOPPED",
            stoppedAt: now,
            nextActionAt: null,
            stopReason: "Lead opted out.",
            processingAt: null,
            processingExecutionId: null,
          },
        });

        results.push({
          campaignLeadId: campaignLead.id,
          leadId: campaignLead.leadId,
          campusName: campaignLead.lead.campus_name,
          step: campaignLead.currentStep,
          channel: null,
          recipient: null,
          status: "STOPPED",
          reason: "Lead is opted out.",
        });

        continue;
      }

      let currentIndex = campaignLead.currentStep;

      if (currentIndex >= steps.length) {
        await prisma.campaignLead.update({
          where: { id: campaignLead.id },
          data: {
            status: "COMPLETED",
            completedAt: now,
            nextActionAt: null,
            processingAt: null,
            processingExecutionId: null,
          },
        });

        results.push({
          campaignLeadId: campaignLead.id,
          leadId: campaignLead.leadId,
          campusName: campaignLead.lead.campus_name,
          step: currentIndex,
          channel: null,
          recipient: null,
          status: "COMPLETED",
          reason: "All campaign steps are complete.",
        });

        continue;
      }

      let processed = false;

      while (currentIndex < steps.length) {
        const step = steps[currentIndex];
        const stepNumber = currentIndex + 1;
        const recipient = resolveRecipient(
          step.channel,
          campaignLead.lead
        );

        const reason = eligibilityReason(
          step.channel,
          campaignLead.lead
        );

        if (!isChannelEligible(step.channel, campaignLead.lead)) {
          await prisma.communicationLog.create({
            data: {
              leadId: campaignLead.leadId,
              campaignId: campaignLead.campaignId,
              campaignStepId: step.id,
              campaignLeadId: campaignLead.id,
              channel: step.channel,
              status: "SKIPPED",
              provider: "DRY_RUN",
              recipient,
              message: renderCampaignTemplate(
                step.messageTemplate,
                campaignLead.lead
              ),
              error: reason,
            },
          });

          currentIndex += 1;

          if (currentIndex >= steps.length) {
            await prisma.campaignLead.update({
              where: { id: campaignLead.id },
              data: {
                status: "COMPLETED",
                currentStep: currentIndex,
                completedAt: now,
                nextActionAt: null,
                processingAt: null,
                processingExecutionId: null,
              },
            });

            results.push({
              campaignLeadId: campaignLead.id,
              leadId: campaignLead.leadId,
              campusName: campaignLead.lead.campus_name,
              step: stepNumber,
              channel: step.channel,
              recipient,
              status: "SKIPPED",
              reason,
            });

            processed = true;
            break;
          }

          await prisma.campaignLead.update({
            where: { id: campaignLead.id },
            data: {
              currentStep: currentIndex,
              status: "WAITING",
              nextActionAt: now,
              processingAt: null,
              processingExecutionId: null,
            },
          });

          results.push({
            campaignLeadId: campaignLead.id,
            leadId: campaignLead.leadId,
            campusName: campaignLead.lead.campus_name,
            step: stepNumber,
            channel: step.channel,
            recipient,
            status: "SKIPPED",
            reason,
          });

          processed = true;
          break;
        }

        const renderedMessage = renderCampaignTemplate(
          step.messageTemplate,
          campaignLead.lead
        );

        const duplicate = await prisma.communicationLog.findFirst({
          where: {
            campaignLeadId: campaignLead.id,
            campaignStepId: step.id,
            status: "DRY_RUN",
          },
          orderBy: {
            attemptedAt: "desc",
          },
        });

        if (duplicate) {
          currentIndex += 1;

          if (currentIndex >= steps.length) {
            await prisma.campaignLead.update({
              where: { id: campaignLead.id },
              data: {
                status: "COMPLETED",
                currentStep: currentIndex,
                completedAt: now,
                nextActionAt: null,
                processingAt: null,
                processingExecutionId: null,
              },
            });

            results.push({
              campaignLeadId: campaignLead.id,
              leadId: campaignLead.leadId,
              campusName: campaignLead.lead.campus_name,
              step: stepNumber,
              channel: step.channel,
              recipient,
              status: "ALREADY_PROCESSED",
            });

            processed = true;
            break;
          }

          const nextStep = steps[currentIndex];

          await prisma.campaignLead.update({
            where: { id: campaignLead.id },
            data: {
              currentStep: currentIndex,
              status: "WAITING",
              nextActionAt: addDays(
                now,
                nextStep.delayDays
              ),
              processingAt: null,
              processingExecutionId: null,
            },
          });

          results.push({
            campaignLeadId: campaignLead.id,
            leadId: campaignLead.leadId,
            campusName: campaignLead.lead.campus_name,
            step: stepNumber,
            channel: step.channel,
            recipient,
            status: "ALREADY_PROCESSED",
          });

          processed = true;
          break;
        }

        const attemptedAt = new Date();
        let providerResult;
        let providerException: string | null = null;

        try {
          providerResult = await dispatchCampaignMessage({
            channel:
              step.channel as "EMAIL" | "WHATSAPP" | "VOICE",
            recipient: recipient || "",
            message: renderedMessage,
            subject: step.subject,
            leadId: campaignLead.leadId,
            campaignId: campaignLead.campaignId,
            campaignStepId: step.id,
          });
        } catch (error) {
          providerException =
            error instanceof Error
              ? error.message
              : String(error);
        }

        const completedAt = new Date();

        if (providerException) {
          await prisma.communicationLog.create({
            data: {
              leadId: campaignLead.leadId,
              campaignId: campaignLead.campaignId,
              campaignStepId: step.id,
              campaignLeadId: campaignLead.id,
              channel: step.channel,
              status: "FAILED",
              provider: "CAMPAIGN_PROVIDER",
              recipient,
              message: renderedMessage,
              error: `Provider exception: ${providerException}`,
              attemptedAt,
              completedAt,
            },
          });

          results.push({
            campaignLeadId: campaignLead.id,
            leadId: campaignLead.leadId,
            campusName: campaignLead.lead.campus_name,
            step: stepNumber,
            channel: step.channel,
            recipient,
            status: "FAILED",
            reason:
              "Provider threw an exception. Campaign lead remains PROCESSING for manual review.",
          });

          processed = true;
          break;
        }

        if (!providerResult.success) {
          await prisma.communicationLog.create({
            data: {
              leadId: campaignLead.leadId,
              campaignId: campaignLead.campaignId,
              campaignStepId: step.id,
              campaignLeadId: campaignLead.id,
              channel: step.channel,
              status: "FAILED",
              provider: providerResult.provider,
              recipient,
              message: renderedMessage,
              error: providerResult.error || "Provider failed.",
              attemptedAt,
              completedAt,
            },
          });

          await prisma.campaignLead.update({
            where: { id: campaignLead.id },
            data: {
              status: originalStatus,
              processingAt: null,
              processingExecutionId: null,
            },
          });

          results.push({
            campaignLeadId: campaignLead.id,
            leadId: campaignLead.leadId,
            campusName: campaignLead.lead.campus_name,
            step: stepNumber,
            channel: step.channel,
            recipient,
            status: "FAILED",
            reason:
              providerResult.error || "Provider failed.",
          });

          processed = true;
          break;
        }

        await prisma.communicationLog.create({
          data: {
            leadId: campaignLead.leadId,
            campaignId: campaignLead.campaignId,
            campaignStepId: step.id,
            campaignLeadId: campaignLead.id,
            channel: step.channel,
            status: providerResult.mode,
            provider: providerResult.provider,
            recipient,
            message: renderedMessage,
            externalId: providerResult.externalId || null,
              attemptedAt,
              completedAt,
          },
        });

        currentIndex += 1;

        if (currentIndex >= steps.length) {
          await prisma.campaignLead.update({
            where: { id: campaignLead.id },
            data: {
              status: "COMPLETED",
              currentStep: currentIndex,
              completedAt: now,
              nextActionAt: null,
              processingAt: null,
              processingExecutionId: null,
            },
          });

          results.push({
            campaignLeadId: campaignLead.id,
            leadId: campaignLead.leadId,
            campusName: campaignLead.lead.campus_name,
            step: stepNumber,
            channel: step.channel,
            recipient,
            status: "DRY_RUN",
            message: renderedMessage,
          });

          processed = true;
          break;
        }

        const nextStep = steps[currentIndex];

        await prisma.campaignLead.update({
          where: { id: campaignLead.id },
          data: {
            currentStep: currentIndex,
            status: "WAITING",
            nextActionAt: addDays(
              now,
              nextStep.delayDays
            ),
            startedAt: campaignLead.startedAt ?? now,
            processingAt: null,
            processingExecutionId: null,
          },
        });

        results.push({
          campaignLeadId: campaignLead.id,
          leadId: campaignLead.leadId,
          campusName: campaignLead.lead.campus_name,
          step: stepNumber,
          channel: step.channel,
          recipient,
          status: "DRY_RUN",
          message: renderedMessage,
        });

        processed = true;
        break;
      }

      if (!processed && currentIndex >= steps.length) {
        await prisma.campaignLead.update({
          where: { id: campaignLead.id },
          data: {
            status: "COMPLETED",
            currentStep: currentIndex,
            completedAt: now,
            nextActionAt: null,
            processingAt: null,
            processingExecutionId: null,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      mode,
      processed: results.length,
      dueCount: dueLeads.length,
      results,
    });
  } catch (error) {
    console.error(
      "Campaign due-step processor failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Campaign due-step processing failed.",
      },
      { status: 500 }
    );
  }
}


/**
 * Scheduler/cron trigger.
 * GET is intentionally protected by CRON_SECRET and always runs DRY_RUN.
 * This does not call email, WhatsApp, or voice providers.
 */
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET?.trim();
  const authorization = request.headers.get("authorization")?.trim() || "";

  if (
    !cronSecret ||
    authorization !== `Bearer ${cronSecret}`
  ) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const url = new URL(request.url);

  const rawLimit = Number(
    url.searchParams.get("limit") || "25"
  );

  const limit = Number.isFinite(rawLimit)
    ? Math.min(Math.max(Math.floor(rawLimit), 1), 100)
    : 25;

  const body = JSON.stringify({
    mode: "DRY_RUN",
    limit,
  });

  const internalRequest = new NextRequest(
    request.url,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cronSecret}`,
      },
      body,
    }
  );

  return POST(internalRequest);
}
