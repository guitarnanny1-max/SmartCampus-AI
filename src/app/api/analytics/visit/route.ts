export const dynamic = 'force-dynamic';
import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";

import { supabaseServer } from "@/lib/supabase/server";

function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    const visitorId =
      typeof body.visitorId === "string"
        ? body.visitorId.trim()
        : "";

    const sessionId =
      typeof body.sessionId === "string"
        ? body.sessionId.trim()
        : "";

    const pagePath =
      typeof body.pagePath === "string"
        ? body.pagePath.trim()
        : "/";

    const referrer =
      typeof body.referrer === "string"
        ? body.referrer.trim()
        : "";

    if (!visitorId) {
      return NextResponse.json(
        {
          error: "visitorId is required",
        },
        { status: 400 },
      );
    }

    const supabase = await supabaseServer();

    const forwardedFor = request.headers.get(
      "x-forwarded-for",
    );

    const realIp = request.headers.get("x-real-ip");

    const ip =
      forwardedFor?.split(",")[0]?.trim() ||
      realIp ||
      "unknown";

    const userAgent =
      request.headers.get("user-agent") || "";

    const ipHash =
      ip !== "unknown"
        ? hashValue(ip)
        : null;

    /*
     * Count each visitor once per day.
     * Refreshing the website repeatedly will not
     * continuously increase the visitor count.
     */

    const startOfDay = new Date();

    startOfDay.setHours(0, 0, 0, 0);

    const {
      data: existingVisitor,
      error: existingError,
    } = await supabase
      .from("website_visitors")
      .select("id")
      .eq("visitor_id", visitorId)
      .gte(
        "visited_at",
        startOfDay.toISOString(),
      )
      .limit(1)
      .maybeSingle();

    if (existingError) {
      console.error(
        "Visitor lookup error:",
        existingError,
      );

      return NextResponse.json(
        {
          error: "Unable to check visitor.",
        },
        { status: 500 },
      );
    }

    if (existingVisitor) {
      return NextResponse.json({
        success: true,
        counted: false,
      });
    }

    const {
      error: insertError,
    } = await supabase
      .from("website_visitors")
      .insert({
        visitor_id: visitorId,
        session_id: sessionId || null,
        page_path: pagePath || "/",
        referrer: referrer || null,
        user_agent: userAgent || null,
        ip_hash: ipHash,
      });

    if (insertError) {
      console.error(
        "Visitor insert error:",
        insertError,
      );

      return NextResponse.json(
        {
          error: "Unable to record visitor.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      counted: true,
    });
  } catch (error) {
    console.error(
      "Visitor analytics error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Visitor tracking failed.",
      },
      { status: 500 },
    );
  }
}
