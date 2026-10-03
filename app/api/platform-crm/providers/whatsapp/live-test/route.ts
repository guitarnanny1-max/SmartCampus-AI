import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePlatformAdmin } from "@/app/lib/platform-auth";
import { WhatsAppProvider } from "@/lib/campaign-providers/whatsapp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    await requirePlatformAdmin();

    const body = await request.json().catch(() => ({}));

    const leadId = String(body?.leadId || "").trim();
    const message = String(body?.message || "").trim();

    if (!leadId) {
      return NextResponse.json(
        { error: "leadId is required." },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        { error: "message is required." },
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
      where: { id: leadId },
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
    console.error("[WhatsApp LIVE Test]", error);

    return NextResponse.json(
      { error: "Unable to execute LIVE WhatsApp test." },
      { status: 500 }
    );
  }
}
