import { NextResponse } from "next/server";
import { requirePlatformAdmin } from "@/app/lib/platform-auth";
import { runAutomationExecution } from "@/lib/platform-crm/automation-engine";

type RouteContext = {
  params: Promise<{ executionId: string }>;
};

export async function POST(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    await requirePlatformAdmin();

    const { executionId } = await params;

    if (!executionId) {
      return NextResponse.json(
        {
          success: false,
          error: "executionId is required",
        },
        { status: 400 },
      );
    }

    const result = await runAutomationExecution(executionId);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Automation resume failed:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Automation resume failed";

    const status =
      message === "Automation execution not found"
        ? 404
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
