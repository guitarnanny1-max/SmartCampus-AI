import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePlatformAdmin } from "@/app/lib/platform-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePlatformAdmin();

    const { id } = await params;

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
        { error: "CRM lead not found" },
        { status: 404 }
      );
    }

    const messages = await prisma.communicationLog.findMany({
      where: {
        leadId: id,
        channel: "WHATSAPP",
      },
      orderBy: {
        attemptedAt: "asc",
      },
      take: 200,
      select: {
        id: true,
        direction: true,
        status: true,
        recipient: true,
        message: true,
        provider: true,
        externalId: true,
        attemptedAt: true,
        completedAt: true,
        error: true,
        campaignId: true,
        campaignStepId: true,
        campaignLeadId: true,
        campaign: {
          select: {
            id: true,
            name: true,
          },
        },
        campaignStep: {
          select: {
            id: true,
            stepOrder: true,
            channel: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      lead,
      messages,
    });
  } catch (error) {
    console.error("[WhatsApp Conversation API]", error);

    return NextResponse.json(
      { error: "Unable to load WhatsApp conversation" },
      { status: 500 }
    );
  }
}
