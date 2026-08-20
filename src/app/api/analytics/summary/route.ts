export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";

import { supabaseServer } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await supabaseServer();

    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay();
    const daysFromMonday = day === 0 ? 6 : day - 1;

    startOfWeek.setDate(
      startOfWeek.getDate() - daysFromMonday,
    );
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
    );

    const [
      totalResult,
      todayResult,
      weekResult,
      monthResult,
    ] = await Promise.all([
      supabase
        .from("website_visitors")
        .select("id", {
          count: "exact",
          head: true,
        }),

      supabase
        .from("website_visitors")
        .select("id", {
          count: "exact",
          head: true,
        })
        .gte(
          "visited_at",
          startOfToday.toISOString(),
        ),

      supabase
        .from("website_visitors")
        .select("id", {
          count: "exact",
          head: true,
        })
        .gte(
          "visited_at",
          startOfWeek.toISOString(),
        ),

      supabase
        .from("website_visitors")
        .select("id", {
          count: "exact",
          head: true,
        })
        .gte(
          "visited_at",
          startOfMonth.toISOString(),
        ),
    ]);

    const errors = [
      totalResult.error,
      todayResult.error,
      weekResult.error,
      monthResult.error,
    ].filter(Boolean);

    if (errors.length > 0) {
      console.error(
        "Analytics summary errors:",
        errors,
      );

      return NextResponse.json(
        {
          error: "Unable to load analytics.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      totalVisitors: totalResult.count ?? 0,
      todayVisitors: todayResult.count ?? 0,
      weekVisitors: weekResult.count ?? 0,
      monthVisitors: monthResult.count ?? 0,
    });
  } catch (error) {
    console.error(
      "Analytics summary error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Unable to load analytics summary.",
      },
      { status: 500 },
    );
  }
}
