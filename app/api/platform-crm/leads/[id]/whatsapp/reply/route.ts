import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePlatformAdmin } from "@/app/lib/platform-auth";
import { dispatchCampaignMessage } from "@/lib/campaign-providers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePlatformAdmin();

    const { id } = await params;
    const body = await request.json();
    const message = String(body?.message || "").trim();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    if (message.length > 4096) {
      return NextResponse.json(
        { error: "Message is too long. Maximum 4096 characters." },
        { status: 400 }
      );
    }

    const lead = await prisma.platform_crm_leads.findUnique({
      where: { id },
      select: {
        id: true,
        campus_name: true,
        contact_name: true,
        whatsappNumber: true,
        whatsappAllowed: true,
        optedOut: true,
      },
    });

    if (!lead) {
      return NextResponse.json(
        { error: "CRM lead not found." },
        { status: 404 }
      );
    }

    if (lead.optedOut) {
      return NextResponse.json(
        { error: "This lead has opted out of communications." },
        { status: 403 }
      );
    }

    if (!lead.whatsappAllowed) {
      return NextResponse.json(
        { error: "WhatsApp communication is not allowed for this lead." },
        { status: 403 }
      );
    }

    if (!lead.whatsappNumber) {
      return NextResponse.json(
        { error: "This lead does not have a WhatsApp number." },
        { status: 400 }
      );
    }

    const attemptedAt = new Date();

    const providerResult = await dispatchCampaignMessage({
      channel: "WHATSAPP",
      recipient: lead.whatsappNumber,
      message,
      subject: undefined,
      leadId: lead.id,
      campaignId: undefined,
      campaignStepId: undefined,
    });

    const completedAt = new Date();

    const communication = await prisma.communicationLog.create({
      data: {
        leadId: lead.id,
        campaignId: null,
        campaignStepId: null,
        campaignLeadId: null,
        channel: "WHATSAPP",
        direction: "OUTBOUND",
        status: providerResult.success
          ? providerResult.mode === "DRY_RUN"
            ? "DRY_RUN"
            : "SENT"
          : "FAILED",
        recipient: lead.whatsappNumber,
        message,
        provider: providerResult.provider || null,
        externalId: providerResult.externalId || null,
        attemptedAt,
        completedAt,
        error: providerResult.error || null,
      },
    });

    return NextResponse.json({
      success: providerResult.success,
      mode: providerResult.mode,
      communication,
    });
  } catch (error) {
    console.error("[WhatsApp Reply API]", error);

    return NextResponse.json(
      { error: "Unable to send WhatsApp reply." },
      { status: 500 }
    );
  }
}
