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
        email: true,
        mobile: true,
        whatsappNumber: true,
      },
    });

    if (!lead) {
      return NextResponse.json(
        { success: false, error: "Lead not found" },
        { status: 404 }
      );
    }

    const communications = await prisma.communicationLog.findMany({
      where: {
        leadId: id,
      },
      orderBy: {
        attemptedAt: "desc",
      },
      take: 200,
      include: {
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
      communications,
    });
  } catch (error) {
    console.error("Lead communications error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized or failed to load communications",
      },
      { status: 401 }
    );
  }
}
