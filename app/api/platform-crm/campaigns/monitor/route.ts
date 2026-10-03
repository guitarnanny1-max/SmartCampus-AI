import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePlatformAdmin } from "@/app/lib/platform-auth";

const ACTIVE_LEAD_STATUSES = new Set(["ACTIVE", "WAITING"]);
const PROCESSED_STATUSES = [
  "DRY_RUN",
  "SENT",
  "DELIVERED",
  "COMPLETED",
];

function istStartOfToday(): Date {
  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
  }).format(new Date());

  return new Date(`${date}T00:00:00+05:30`);
}

export async function GET() {
  const user = await requirePlatformAdmin();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const now = new Date();
    const todayStart = istStartOfToday();

    const [campaigns, todaysProcessed, todaysSkipped] = await Promise.all([
      prisma.campaign.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          steps: {
            orderBy: { stepOrder: "asc" },
          },
          leads: {
            select: {
              id: true,
              status: true,
              currentStep: true,
              nextActionAt: true,
              startedAt: true,
              completedAt: true,
              stoppedAt: true,
              stopReason: true,
              processingAt: true,
              processingExecutionId: true,
              lead: {
                select: {
                  id: true,
                  campus_name: true,
                  contact_name: true,
                  email: true,
                  mobile: true,
                  whatsappNumber: true,
                  optedOut: true,
                },
              },
            },
          },
        },
      }),
      prisma.communicationLog.count({
        where: {
          attemptedAt: { gte: todayStart },
          status: { in: PROCESSED_STATUSES },
        },
      }),
      prisma.communicationLog.count({
        where: {
          attemptedAt: { gte: todayStart },
          status: "SKIPPED",
        },
      }),
    ]);

    const activeCampaigns = campaigns.filter((campaign) => campaign.status === "ACTIVE");

    const campaignSummaries = campaigns.map((campaign) => {
      const dueLeads = campaign.leads.filter((campaignLead) => {
        if (!ACTIVE_LEAD_STATUSES.has(campaignLead.status)) return false;
        if (!campaignLead.nextActionAt) return true;
        return campaignLead.nextActionAt <= now;
      });

      const waitingLeads = campaign.leads.filter((campaignLead) => {
        return (
          campaignLead.status === "WAITING" &&
          Boolean(campaignLead.nextActionAt) &&
          campaignLead.nextActionAt! > now
        );
      });

      const completedLeads = campaign.leads.filter(
        (campaignLead) => campaignLead.status === "COMPLETED"
      );

      const processingLeads = campaign.leads.filter(
        (campaignLead) => campaignLead.status === "PROCESSING"
      );

      const stoppedLeads = campaign.leads.filter(
        (campaignLead) =>
          campaignLead.status === "STOPPED" ||
          Boolean(campaignLead.stoppedAt)
      );

      const nextAction = waitingLeads
        .map((campaignLead) => campaignLead.nextActionAt)
        .filter((value): value is Date => value instanceof Date)
        .sort((a, b) => a.getTime() - b.getTime())[0] ?? null;

      return {
        id: campaign.id,
        name: campaign.name,
        description: campaign.description,
        status: campaign.status,
        createdAt: campaign.createdAt,
        updatedAt: campaign.updatedAt,
        totalLeads: campaign.leads.length,
        dueNow: campaign.status === "ACTIVE" ? dueLeads.length : 0,
        waiting: campaign.status === "ACTIVE" ? waitingLeads.length : 0,
        completed: completedLeads.length,
        processing: processingLeads.length,
        stopped: stoppedLeads.length,
        nextActionAt: campaign.status === "ACTIVE" ? nextAction : null,
        steps: campaign.steps,
        leads: campaign.leads,
      };
    });

    const nextActions = campaignSummaries
      .filter((campaign) => campaign.status === "ACTIVE" && campaign.nextActionAt)
      .map((campaign) => ({
        campaignId: campaign.id,
        campaignName: campaign.name,
        nextActionAt: campaign.nextActionAt,
      }))
      .sort(
        (a, b) =>
          new Date(a.nextActionAt!).getTime() -
          new Date(b.nextActionAt!).getTime()
      );

    const dueNow = campaignSummaries.reduce(
      (sum, campaign) => sum + campaign.dueNow,
      0
    );

    const waiting = campaignSummaries.reduce(
      (sum, campaign) => sum + campaign.waiting,
      0
    );

    return NextResponse.json({
      success: true,
      serverNow: now,
      todayStart,
      summary: {
        activeCampaigns: activeCampaigns.length,
        dueNow,
        waiting,
        processing: campaignSummaries.reduce(
          (sum, campaign) => sum + campaign.processing,
          0
        ),
        processedToday: todaysProcessed,
        skippedToday: todaysSkipped,
        nextAction: nextActions[0] ?? null,
      },
      campaigns: campaignSummaries,
    });
  } catch (error) {
    console.error("Failed to fetch scheduler monitor:", error);

    return NextResponse.json(
      { error: "Failed to fetch scheduler monitor" },
      { status: 500 }
    );
  }
}
