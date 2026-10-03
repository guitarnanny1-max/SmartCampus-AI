import { NextResponse } from "next/server";
import { requirePlatformAdmin } from "@/app/lib/platform-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requirePlatformAdmin();

    const automations = await prisma.crmAutomation.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        steps: {
          orderBy: { stepOrder: "asc" },
        },
        _count: {
          select: {
            executions: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      automations,
    });
  } catch (error) {
    console.error("Failed to list automations:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to list automations",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await requirePlatformAdmin();

    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : null;

    const triggerType =
      typeof body.triggerType === "string"
        ? body.triggerType.trim()
        : "";

    const status =
      typeof body.status === "string"
        ? body.status.trim()
        : "ACTIVE";

    const steps = Array.isArray(body.steps) ? body.steps : [];

    if (!name) {
      return NextResponse.json(
        { success: false, error: "name is required" },
        { status: 400 },
      );
    }

    if (!triggerType) {
      return NextResponse.json(
        { success: false, error: "triggerType is required" },
        { status: 400 },
      );
    }

    if (steps.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one step is required" },
        { status: 400 },
      );
    }

    const normalizedSteps = steps.map(
      (step: Record<string, unknown>, index: number) => ({
        stepOrder:
          typeof step.stepOrder === "number"
            ? step.stepOrder
            : index,
        actionType:
          typeof step.actionType === "string"
            ? step.actionType.trim()
            : "",
        config:
          step.config &&
          typeof step.config === "object" &&
          !Array.isArray(step.config)
            ? step.config
            : {},
        delayMinutes:
          typeof step.delayMinutes === "number" &&
          Number.isFinite(step.delayMinutes) &&
          step.delayMinutes >= 0
            ? Math.floor(step.delayMinutes)
            : 0,
        requiresApproval:
          step.requiresApproval === true,
      }),
    );

    const invalidStep = normalizedSteps.find(
      (step) => !step.actionType,
    );

    if (invalidStep) {
      return NextResponse.json(
        {
          success: false,
          error: "Every automation step requires actionType",
        },
        { status: 400 },
      );
    }

    const duplicateOrders = new Set<number>();

    for (const step of normalizedSteps) {
      if (duplicateOrders.has(step.stepOrder)) {
        return NextResponse.json(
          {
            success: false,
            error: "Automation stepOrder values must be unique",
          },
          { status: 400 },
        );
      }

      duplicateOrders.add(step.stepOrder);
    }

    const automation = await prisma.crmAutomation.create({
      data: {
        name,
        description,
        triggerType,
        status,
        steps: {
          create: normalizedSteps,
        },
      },
      include: {
        steps: {
          orderBy: { stepOrder: "asc" },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        automation,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create automation:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create automation",
      },
      { status: 500 },
    );
  }
}
