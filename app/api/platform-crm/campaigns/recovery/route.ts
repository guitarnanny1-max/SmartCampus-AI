import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePlatformAdmin } from "@/app/lib/platform-auth";

const CONFIRMATION = "CAMPAIGN_PROCESSING_RECOVERY";

export async function POST(request: Request) {
  const user = await requirePlatformAdmin();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const campaignLeadId =
      typeof body?.campaignLeadId === "string"
        ? body.campaignLeadId.trim()
        : "";

    const action =
      typeof body?.action === "string"
        ? body.action.trim().toUpperCase()
        : "";

    const confirmation =
      typeof body?.confirmation === "string"
        ? body.confirmation.trim()
        : "";

    if (!campaignLeadId) {
      return NextResponse.json(
        { error: "campaignLeadId is required." },
        { status: 400 }
      );
    }

    if (!["RETRY", "COMPLETE"].includes(action)) {
      return NextResponse.json(
        { error: "Action must be RETRY or COMPLETE." },
        { status: 400 }
      );
    }

    if (confirmation !== CONFIRMATION) {
      return NextResponse.json(
        { error: "Explicit recovery confirmation is required." },
        { status: 400 }
      );
    }

    const campaignLead = await prisma.campaignLead.findUnique({
      where: { id: campaignLeadId },
      include: {
        campaign: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        lead: {
          select: {
            id: true,
            campus_name: true,
            contact_name: true,
            mobile: true,
            whatsappNumber: true,
          },
        },
      },
    });

    if (!campaignLead) {
      return NextResponse.json(
        { error: "Campaign lead not found." },
        { status: 404 }
      );
    }

    if (campaignLead.status !== "PROCESSING") {
      return NextResponse.json(
        {
          error: `Campaign lead is ${campaignLead.status}, not PROCESSING.`,
        },
        { status: 409 }
      );
    }

    const now = new Date();

    if (action === "RETRY") {
      const updated = await prisma.campaignLead.updateMany({
        where: {
          id: campaignLeadId,
          status: "PROCESSING",
        },
        data: {
          status: "ACTIVE",
          processingAt: null,
          processingExecutionId: null,
          stoppedAt: null,
          stopReason: null,
          nextActionAt: now,
        },
      });

      if (updated.count !== 1) {
        return NextResponse.json(
          { error: "Campaign lead changed before recovery could be applied." },
          { status: 409 }
        );
      }

      await prisma.communicationLog.create({
        data: {
          leadId: campaignLead.leadId,
          campaignId: campaignLead.campaignId,
          campaignLeadId: campaignLead.id,
          channel: "SYSTEM",
          direction: "OUTBOUND",
          status: "RECOVERY_RETRY",
          recipient: campaignLead.lead.whatsappNumber ?? campaignLead.lead.mobile,
          message:
            "PROCESSING campaign lead manually released for explicit retry.",
          provider: "CRM_RECOVERY",
          attemptedAt: now,
          completedAt: now,
        },
      });

      return NextResponse.json({
        success: true,
        action,
        campaignLeadId,
        status: "ACTIVE",
      });
    }

    const updated = await prisma.campaignLead.updateMany({
      where: {
        id: campaignLeadId,
        status: "PROCESSING",
      },
      data: {
        status: "COMPLETED",
        completedAt: now,
        processingAt: null,
        processingExecutionId: null,
      },
    });

    if (updated.count !== 1) {
      return NextResponse.json(
        { error: "Campaign lead changed before recovery could be applied." },
        { status: 409 }
      );
    }

    await prisma.communicationLog.create({
      data: {
        leadId: campaignLead.leadId,
        campaignId: campaignLead.campaignId,
        campaignLeadId: campaignLead.id,
        channel: "SYSTEM",
        direction: "OUTBOUND",
        status: "RECOVERY_COMPLETED",
        recipient: campaignLead.lead.whatsappNumber ?? campaignLead.lead.mobile,
        message:
          "PROCESSING campaign lead manually marked completed after review.",
        provider: "CRM_RECOVERY",
        attemptedAt: now,
        completedAt: now,
      },
    });

    return NextResponse.json({
      success: true,
      action,
      campaignLeadId,
      status: "COMPLETED",
    });
  } catch (error) {
    console.error("Campaign processing recovery failed:", error);

    return NextResponse.json(
      { error: "Campaign processing recovery failed." },
      { status: 500 }
    );
  }
}
