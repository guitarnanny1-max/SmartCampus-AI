import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePlatformAdmin } from "@/app/lib/platform-auth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

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
    const existing = await prisma.platform_crm_leads.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "CRM lead not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const data: Record<string, unknown> = {};

    const stringFields = [
      "campus_name",
      "contact_name",
      "contact_role",
      "email",
      "mobile",
      "city",
      "state",
      "country",
      "school_type",
      "current_software",
      "requirements",
      "source",
      "assigned_to",
      "website",
      "emailSource",
      "phoneSource",
      "whatsappSource",
      "whatsappNumber",
      "optOutSource",
    ];

    for (const field of stringFields) {
      if (typeof body[field] === "string") {
        const value = body[field].trim();
        data[field] = value || null;
      }
    }

    if (
      "campus_name" in body &&
      !String(data.campus_name || "").trim()
    ) {
      return NextResponse.json(
        { error: "campus_name cannot be empty" },
        { status: 400 }
      );
    }

    for (const field of [
      "emailAllowed",
      "whatsappAllowed",
      "voiceAllowed",
    ]) {
      if (typeof body[field] === "boolean") {
        data[field] = body[field];
      }
    }

    if (typeof body.optedOut === "boolean") {
      if (body.optedOut === true) {
        data.optedOut = true;
        data.optedOutAt = new Date();
        data.optOutSource =
          typeof body.optOutSource === "string" &&
          body.optOutSource.trim()
            ? body.optOutSource.trim()
            : "CRM_ADMIN";

        data.emailAllowed = false;
        data.whatsappAllowed = false;
        data.voiceAllowed = false;
      } else {
        data.optedOut = false;
        data.optedOutAt = null;
        data.optOutSource = null;
      }
    }

    const lead = await prisma.platform_crm_leads.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      success: true,
      lead,
    });
  } catch (error) {
    console.error("Platform CRM lead update failed:", error);

    return NextResponse.json(
      { error: "Failed to update platform CRM lead" },
      { status: 500 }
    );
  }
}
