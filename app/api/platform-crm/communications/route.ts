import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePlatformAdmin } from "@/app/lib/platform-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await requirePlatformAdmin();

    const { searchParams } = new URL(request.url);

    const campaignId = searchParams.get("campaignId")?.trim() || "";
    const channel = searchParams.get("channel")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";
    const direction = searchParams.get("direction")?.trim() || "";
    const q = searchParams.get("q")?.trim() || "";

    const logs = await prisma.communicationLog.findMany({
      where: {
        ...(campaignId ? { campaignId } : {}),
        ...(channel ? { channel } : {}),
        ...(status ? { status } : {}),
        ...(direction ? { direction } : {}),
        ...(q
          ? {
              OR: [
                { recipient: { contains: q, mode: "insensitive" } },
                { message: { contains: q, mode: "insensitive" } },
                {
                  lead: {
                    OR: [
                      { campus_name: { contains: q, mode: "insensitive" } },
                      { contact_name: { contains: q, mode: "insensitive" } },
                      { email: { contains: q, mode: "insensitive" } },
                      { mobile: { contains: q, mode: "insensitive" } },
                      { whatsappNumber: { contains: q, mode: "insensitive" } },
                    ],
                  },
                },
              ],
            }
          : {}),
      },
      orderBy: {
        attemptedAt: "desc",
      },
      take: 200,
      include: {
        lead: {
          select: {
            id: true,
            campus_name: true,
            contact_name: true,
            email: true,
            mobile: true,
            whatsappNumber: true,
          },
        },
        campaign: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      logs,
    });
  } catch (error) {
    console.error("Communication history error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load communication history.",
      },
      { status: 500 },
    );
  }
}
