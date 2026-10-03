import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePlatformAdmin } from "@/app/lib/platform-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ALLOWED_CHANNELS = new Set([
  "EMAIL",
  "WHATSAPP",
  "VOICE",
]);

export async function GET() {
  const user = await requirePlatformAdmin();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        steps: {
          orderBy: {
            stepOrder: "asc",
          },
        },
        _count: {
          select: {
            leads: true,
            logs: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      campaigns,
    });
  } catch (error) {
    console.error("Failed to fetch campaigns:", error);

    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const user = await requirePlatformAdmin();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    if (!name) {
      return NextResponse.json(
        { error: "Campaign name is required" },
        { status: 400 }
      );
    }

    const description =
      typeof body.description === "string"
        ? body.description.trim() || null
        : null;

    const rawSteps = Array.isArray(body.steps)
      ? body.steps
      : [];

    const steps = rawSteps.map((step: unknown, index: number) => {
      const item =
        step && typeof step === "object"
          ? step as Record<string, unknown>
          : {};

      const channel =
        typeof item.channel === "string"
          ? item.channel.trim().toUpperCase()
          : "";

      const delayDays =
        Number.isInteger(item.delayDays) &&
        Number(item.delayDays) >= 0
          ? Number(item.delayDays)
          : 0;

      const subject =
        typeof item.subject === "string"
          ? item.subject.trim() || null
          : null;

      const messageTemplate =
        typeof item.messageTemplate === "string"
          ? item.messageTemplate.trim() || null
          : null;

      return {
        stepOrder: index + 1,
        channel,
        delayDays,
        subject,
        messageTemplate,
      };
    });

    for (const step of steps) {
      if (!ALLOWED_CHANNELS.has(step.channel)) {
        return NextResponse.json(
          {
            error:
              "Invalid campaign channel. Allowed channels: EMAIL, WHATSAPP, VOICE",
          },
          { status: 400 }
        );
      }

      if (step.channel === "EMAIL" && !step.messageTemplate) {
        return NextResponse.json(
          {
            error: `Campaign step ${step.stepOrder} requires a message`,
          },
          { status: 400 }
        );
      }

      if (step.channel === "WHATSAPP" && !step.messageTemplate) {
        return NextResponse.json(
          {
            error: `Campaign step ${step.stepOrder} requires a message`,
          },
          { status: 400 }
        );
      }

      if (step.channel === "VOICE" && !step.messageTemplate) {
        return NextResponse.json(
          {
            error: `Campaign step ${step.stepOrder} requires a call script`,
          },
          { status: 400 }
        );
      }
    }

    const campaign = await prisma.campaign.create({
      data: {
        name,
        description,
        status: "DRAFT",
        steps: {
          create: steps,
        },
      },
      include: {
        steps: {
          orderBy: {
            stepOrder: "asc",
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        campaign,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create campaign:", error);

    return NextResponse.json(
      { error: "Failed to create campaign" },
      { status: 500 }
    );
  }
}
