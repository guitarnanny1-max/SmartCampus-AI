import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePlatformAdmin } from "@/app/lib/platform-auth";

export async function GET(request: NextRequest) {
  const user = await requirePlatformAdmin();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() || "";

    const where = q
      ? {
          OR: [
            {
              campus_name: {
                contains: q,
                mode: "insensitive" as const,
              },
            },
            {
              contact_name: {
                contains: q,
                mode: "insensitive" as const,
              },
            },
            {
              contact_role: {
                contains: q,
                mode: "insensitive" as const,
              },
            },
            {
              email: {
                contains: q,
                mode: "insensitive" as const,
              },
            },
            {
              mobile: {
                contains: q,
                mode: "insensitive" as const,
              },
            },
            {
              city: {
                contains: q,
                mode: "insensitive" as const,
              },
            },
            {
              state: {
                contains: q,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : undefined;

    const leads = await prisma.platform_crm_leads.findMany({
      where,
      take: 200,
      orderBy: {
        created_at: "desc",
      },
      select: {
        id: true,
        campus_name: true,
        contact_name: true,
        contact_role: true,
        email: true,
        mobile: true,
        city: true,
        state: true,
        website: true,
        emailSource: true,
        phoneSource: true,
        whatsappSource: true,
        whatsappNumber: true,
        emailAllowed: true,
        whatsappAllowed: true,
        voiceAllowed: true,
        optedOut: true,
      },
    });

    return NextResponse.json({
      success: true,
      leads,
    });
  } catch (error) {
    console.error("Platform CRM lead fetch failed:", error);

    return NextResponse.json(
      { error: "Failed to fetch platform CRM leads" },
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

    const campusName =
      typeof body.campus_name === "string"
        ? body.campus_name.trim()
        : "";

    if (!campusName) {
      return NextResponse.json(
        { error: "campus_name is required" },
        { status: 400 }
      );
    }

    const rawWebsite =
      typeof body.website === "string"
        ? body.website.trim()
        : "";

    let normalizedWebsite: string | null = null;

    if (rawWebsite) {
      if (
        rawWebsite.startsWith("[") ||
        rawWebsite.includes("](") ||
        rawWebsite.includes(")")
      ) {
        return NextResponse.json(
          { error: "website must be a plain http or https URL" },
          { status: 400 }
        );
      }

      try {
        const url = new URL(rawWebsite);

        if (!["http:", "https:"].includes(url.protocol)) {
          return NextResponse.json(
            { error: "website must use http or https" },
            { status: 400 }
          );
        }

        normalizedWebsite = url.toString();
      } catch {
        return NextResponse.json(
          { error: "Invalid website URL" },
          { status: 400 }
        );
      }
    }

    const optedOut = body.optedOut === true;

    if (optedOut) {
      return NextResponse.json(
        { error: "Opted-out leads cannot be created for campaigns" },
        { status: 400 }
      );
    }

    const lead = await prisma.platform_crm_leads.create({
      data: {
        campus_name: campusName,
        contact_name:
          typeof body.contact_name === "string"
            ? body.contact_name.trim() || null
            : null,
        contact_role:
          typeof body.contact_role === "string"
            ? body.contact_role.trim() || null
            : null,
        email:
          typeof body.email === "string"
            ? body.email.trim() || null
            : null,
        mobile:
          typeof body.mobile === "string"
            ? body.mobile.trim() || null
            : null,
        city:
          typeof body.city === "string"
            ? body.city.trim() || null
            : null,
        state:
          typeof body.state === "string"
            ? body.state.trim() || null
            : null,
        country:
          typeof body.country === "string"
            ? body.country.trim() || "India"
            : "India",
        school_type:
          typeof body.school_type === "string"
            ? body.school_type.trim() || null
            : null,
        student_count:
          Number.isInteger(body.student_count)
            ? body.student_count
            : null,
        teacher_count:
          Number.isInteger(body.teacher_count)
            ? body.teacher_count
            : null,
        current_software:
          typeof body.current_software === "string"
            ? body.current_software.trim() || null
            : null,
        requirements:
          typeof body.requirements === "string"
            ? body.requirements.trim() || null
            : null,
        source:
          typeof body.source === "string"
            ? body.source.trim() || "MANUAL"
            : "MANUAL",
        assigned_to:
          typeof body.assigned_to === "string"
            ? body.assigned_to.trim() || null
            : null,

        website: normalizedWebsite,

        websiteExtractedAt: body.websiteExtractedAt
          ? new Date(body.websiteExtractedAt)
          : null,

        emailSource:
          typeof body.emailSource === "string"
            ? body.emailSource.trim() || null
            : null,

        phoneSource:
          typeof body.phoneSource === "string"
            ? body.phoneSource.trim() || null
            : null,

        whatsappSource:
          typeof body.whatsappSource === "string"
            ? body.whatsappSource.trim() || null
            : null,

        whatsappNumber:
          typeof body.whatsappNumber === "string"
            ? body.whatsappNumber.trim() || null
            : null,

        emailAllowed: body.emailAllowed === true,
        whatsappAllowed: body.whatsappAllowed === true,
        voiceAllowed: body.voiceAllowed === true,

        optedOut: false,
        optedOutAt: null,
        optOutSource: null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        lead,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Platform CRM lead creation failed:", error);

    return NextResponse.json(
      { error: "Failed to create platform CRM lead" },
      { status: 500 }
    );
  }
}
