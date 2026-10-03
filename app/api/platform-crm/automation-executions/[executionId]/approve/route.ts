import { NextResponse } from "next/server";
import { requirePlatformAdmin } from "@/app/lib/platform-auth";
import { approveAutomationStep } from "@/lib/platform-crm/automation-engine";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ executionId: string }> },
) {
  try {
    const user = await requirePlatformAdmin();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { executionId } = await params;

    if (!executionId) {
      return NextResponse.json(
        { success: false, error: "executionId is required" },
        { status: 400 },
      );
    }

    const body = await request.json().catch(() => ({}));

    const stepId =
      typeof body.stepId === "string" ? body.stepId.trim() : "";

    const note =
      typeof body.note === "string" ? body.note.trim() : undefined;

    if (!stepId) {
      return NextResponse.json(
        { success: false, error: "stepId is required" },
        { status: 400 },
      );
    }

    const result = await approveAutomationStep(
      executionId,
      stepId,
      user.email ?? user.id,
      note,
    );

    return NextResponse.json({
      success: true,
      executionId,
      approvedBy: user.email ?? user.id,
      ...result,
    });
  } catch (error) {
    console.error("Automation approval error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to approve automation step",
      },
      { status: 500 },
    );
  }
}
