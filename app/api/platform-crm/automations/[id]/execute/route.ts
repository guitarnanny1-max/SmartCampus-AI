import { NextResponse } from "next/server";
import { requirePlatformAdmin } from "@/app/lib/platform-auth";
import {
  createAutomationExecution,
  runAutomationExecution,
} from "@/lib/platform-crm/automation-engine";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(
  request: Request,
  { params }: RouteContext,
) {
  try {
    await requirePlatformAdmin();

    const { id: automationId } = await params;

    let body: {
      leadId?: string;
      context?: Record<string, unknown>;
    } = {};

    try {
      body = await request.json();
    } catch {
      // Empty request body is valid.
    }

    const execution = await createAutomationExecution(
      automationId,
      body.leadId,
      body.context,
    );

    const result = await runAutomationExecution(execution.id);

    return NextResponse.json({
      success: true,
      executionId: execution.id,
      ...result,
    });
  } catch (error) {
    console.error("Automation execution failed:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Automation execution failed";

    const status =
      message === "Automation not found" ||
      message === "Lead not found"
        ? 404
        : message === "Automation is not active" ||
            message === "Automation has no steps"
          ? 400
          : 500;

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status },
    );
  }
}
