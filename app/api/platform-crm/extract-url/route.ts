import { NextRequest, NextResponse } from "next/server";
import { requirePlatformAdmin } from "@/app/lib/platform-auth";
import { extractPublicWebsite } from "@/lib/platform-crm/url-extractor";

export async function POST(request: NextRequest) {
  const user = await requirePlatformAdmin();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();

    const website =
      typeof body.website === "string"
        ? body.website.trim()
        : "";

    const result = await extractPublicWebsite(website);

    return NextResponse.json({
      success: true,
      source: result.source,
      extracted: result.extracted,
    });
  } catch (error) {
    console.error("URL extraction failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "URL extraction failed",
      },
      { status: 400 },
    );
  }
}
