export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";

import { supabaseServer } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await supabaseServer();

    const { count, error } = await supabase
      .from("website_visitors")
      .select("id", {
        count: "exact",
        head: true,
      });

    if (error) {
      console.error(
        "Visitor count error:",
        error,
      );

      return NextResponse.json(
        {
          error: "Unable to retrieve visitor count.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      visitors: count ?? 0,
    });
  } catch (error) {
    console.error(
      "Visitor statistics error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Unable to retrieve visitor statistics.",
      },
      { status: 500 },
    );
  }
}
