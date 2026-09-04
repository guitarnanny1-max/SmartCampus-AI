import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseAdmin() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function cleanString(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const cleaned = value.trim();

  return cleaned || null;
}

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Lead ID is required." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("crm_lead_activities")
      .select(
        `
          id,
          lead_id,
          activity_type,
          title,
          description,
          created_at,
          created_by
        `,
      )
      .eq("lead_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("CRM activity fetch error:", error);

      return NextResponse.json(
        {
          error: "Unable to load lead activities.",
          details:
            process.env.NODE_ENV === "development"
              ? error.message
              : undefined,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      activities: data || [],
    });
  } catch (error) {
    console.error("CRM activity GET error:", error);

    return NextResponse.json(
      {
        error: "Unable to load lead activities.",
        details:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Lead ID is required." },
        { status: 400 },
      );
    }

    let body: Record<string, unknown>;

    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400 },
      );
    }

    const activityType =
      cleanString(body.activityType) ||
      cleanString(body.activity_type) ||
      "NOTE";

    const title = cleanString(body.title);
    const description =
      cleanString(body.description) ||
      cleanString(body.note);

    if (!title && !description) {
      return NextResponse.json(
        {
          error: "Activity title or description is required.",
        },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("crm_lead_activities")
      .insert({
        lead_id: id,
        activity_type: activityType.toUpperCase(),
        title: title || activityType,
        description: description || null,
      })
      .select(
        `
          id,
          lead_id,
          activity_type,
          title,
          description,
          created_at,
          created_by
        `,
      )
      .single();

    if (error) {
      console.error("CRM activity creation error:", error);

      return NextResponse.json(
        {
          error: "Unable to create lead activity.",
          details:
            process.env.NODE_ENV === "development"
              ? error.message
              : undefined,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Lead activity created successfully.",
        activity: data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("CRM activity POST error:", error);

    return NextResponse.json(
      {
        error: "Unable to create lead activity.",
        details:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 },
    );
  }
}
