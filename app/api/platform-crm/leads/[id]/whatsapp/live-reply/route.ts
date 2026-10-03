import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePlatformAdmin } from "@/app/lib/platform-auth";
import { WhatsAppProvider } from "@/lib/campaign-providers/whatsapp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePlatformAdmin();

    const providerMode =
      process.env.CAMPAIGN_PROVIDER_MODE?.trim() || "DRY_RUN";

    if (providerMode !== "DRY_RUN") {
      return NextResponse.json(
        {
          error:
            "LIVE CRM reply is disabled unless CAMPAIGN_PROVIDER_MODE is DRY_RUN.",
        },
        { status: 409 }
      );
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));

    const message = String(body?.message || "").trim();
    const confirmation = String(body?.confirmation || "").trim();

    if (confirmation !== "LIVE_REPLY") {
      return NextResponse.json(
        { error: "LIVE reply confirmation is required." },
        { status: 400 }
      );
    }

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
        { error: "Lead has opted out of communications." },
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
        { error: "Lead has no WhatsApp number." },
        { status: 400 }
      );
    }

    const provider = new WhatsAppProvider();

    const attemptedAt = new Date();

    const providerResult = await provider.send({
      channel: "WHATSAPP",
      recipient: lead.whatsappNumber,
      message,
      leadId: lead.id,
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

    return NextResponse.json({
      success: providerResult.success,
      mode: providerResult.mode,
      provider: providerResult.provider,
      externalId: providerResult.externalId || null,
      communication,
    });
  } catch (error) {
    console.error("[WhatsApp LIVE Reply]", error);

    return NextResponse.json(
      { error: "Unable to send LIVE WhatsApp reply." },
      { status: 500 }
    );
  }
}
