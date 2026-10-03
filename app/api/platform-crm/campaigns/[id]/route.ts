import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePlatformAdmin } from "@/app/lib/platform-auth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  void request;

  const user = await requirePlatformAdmin();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await context.params;

  try {
    const campaign = await prisma.campaign.findUnique({
      where: {
        id,
      },
      include: {
        steps: {
          orderBy: {
            stepOrder: "asc",
          },
        },
        leads: {
          orderBy: {
            startedAt: "desc",
          },
          include: {
            lead: {
              select: {
                id: true,
                campus_name: true,
                contact_name: true,
                email: true,
                mobile: true,
                whatsappNumber: true,
                emailAllowed: true,
                whatsappAllowed: true,
                voiceAllowed: true,
                optedOut: true,
              },
            },
          },
        },
        _count: {
          select: {
            logs: true,
          },
        },
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      campaign,
    });
  } catch (error) {
    console.error("Failed to fetch campaign:", error);

    return NextResponse.json(
      { error: "Failed to fetch campaign" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  const user = await requirePlatformAdmin();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await context.params;

  try {
    const existing = await prisma.campaign.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const data: {
      name?: string;
      description?: string | null;
      status?: string;
    } = {};

    if (typeof body.name === "string") {
      const name = body.name.trim();

      if (!name) {
        return NextResponse.json(
          { error: "Campaign name cannot be empty" },
          { status: 400 }
        );
      }

      data.name = name;
    }

    if (typeof body.description === "string") {
      data.description = body.description.trim() || null;
    }

    if (typeof body.status === "string") {
      const status = body.status.trim().toUpperCase();

      if (
        !["DRAFT", "ACTIVE", "PAUSED", "COMPLETED", "CANCELLED"].includes(
          status
        )
      ) {
        return NextResponse.json(
          { error: "Invalid campaign status" },
          { status: 400 }
        );
      }

      data.status = status;
    }

    const campaign = await prisma.campaign.update({
      where: { id },
      data,
      include: {
        steps: {
          orderBy: {
            stepOrder: "asc",
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      campaign,
    });
  } catch (error) {
    console.error("Failed to update campaign:", error);

    return NextResponse.json(
      { error: "Failed to update campaign" },
      { status: 500 }
    );
  }
}
