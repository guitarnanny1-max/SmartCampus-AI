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

function cleanDateTime(value: unknown): string | null {
  const cleaned = cleanString(value);

  if (!cleaned) return null;

  const date = new Date(cleaned);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

function createInterviewId() {
  return `interview_${crypto.randomUUID()}`;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const { searchParams } = new URL(request.url);

    const applicationId = cleanString(searchParams.get("applicationId"));
    const status = cleanString(searchParams.get("status"));
    const mode = cleanString(searchParams.get("mode"));

    let query = supabase
      .from("Interview")
      .select(`
        id,
        applicationId,
        scheduledAt,
        interviewerName,
        mode,
        status,
        score,
        feedback,
        createdAt,
        updatedAt
      `)
      .order("createdAt", { ascending: false });

    if (applicationId) {
      query = query.eq("applicationId", applicationId);
    }

    if (status) {
      query = query.eq("status", status);
    }

    if (mode) {
      query = query.eq("mode", mode);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Interview list error:", error);

      return NextResponse.json(
        {
          error: "Unable to load interviews.",
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
      interviews: data ?? [],
      count: data?.length ?? 0,
    });
  } catch (error) {
    console.error("Interview GET error:", error);

    return NextResponse.json(
      {
        error: "Unable to load interviews.",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as
      | Record<string, unknown>
      | null;

    if (!body) {
      return NextResponse.json(
        {
          error: "Invalid JSON request body.",
        },
        { status: 400 },
      );
    }

    const applicationId = cleanString(body.applicationId);
    const scheduledAt = cleanDateTime(body.scheduledAt);
    const interviewerName = cleanString(body.interviewerName);
    const mode = cleanString(body.mode) || "IN_PERSON";

    if (!applicationId) {
      return NextResponse.json(
        {
          error: "Application ID is required.",
        },
        { status: 400 },
      );
    }

    if (!scheduledAt) {
      return NextResponse.json(
        {
          error: "A valid interview date and time is required.",
        },
        { status: 400 },
      );
    }

    const allowedModes = [
      "IN_PERSON",
      "ONLINE",
      "PHONE",
    ];

    if (!allowedModes.includes(mode)) {
      return NextResponse.json(
        {
          error: "Invalid interview mode.",
          allowedModes,
        },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();

    /*
     * 1. Verify application exists.
     */
    const { data: application, error: applicationError } = await supabase
      .from("Application")
      .select(`
        id,
        applicantId,
        tenantId,
        applicationNumber,
        status
      `)
      .eq("id", applicationId)
      .maybeSingle();

    if (applicationError) {
      console.error(
        "Interview application verification error:",
        applicationError,
      );

      return NextResponse.json(
        {
          error: "Unable to verify application.",
          details:
            process.env.NODE_ENV === "development"
              ? applicationError.message
              : undefined,
        },
        { status: 500 },
      );
    }

    if (!application) {
      return NextResponse.json(
        {
          error: "Application not found.",
        },
        { status: 404 },
      );
    }

    /*
     * 2. Prevent multiple active scheduled interviews
     *    for the same application.
     */
    const { data: existingInterview, error: duplicateError } = await supabase
      .from("Interview")
      .select(`
        id,
        applicationId,
        scheduledAt,
        interviewerName,
        mode,
        status,
        score,
        feedback
      `)
      .eq("applicationId", applicationId)
      .in("status", ["SCHEDULED", "COMPLETED"])
      .maybeSingle();

    if (duplicateError) {
      console.error(
        "Interview duplicate check error:",
        duplicateError,
      );

      return NextResponse.json(
        {
          error: "Unable to check existing interview.",
          details:
            process.env.NODE_ENV === "development"
              ? duplicateError.message
              : undefined,
        },
        { status: 500 },
      );
    }

    if (existingInterview) {
      return NextResponse.json(
        {
          error: "An interview already exists for this application.",
          interview: existingInterview,
        },
        { status: 409 },
      );
    }

    /*
     * 3. Create interview.
     */
    const interviewId = createInterviewId();

    const { data: interview, error: interviewError } = await supabase
      .from("Interview")
      .insert({
        id: interviewId,
        applicationId,
        scheduledAt,
        interviewerName,
        mode,
        status: "SCHEDULED",
      })
      .select(`
        id,
        applicationId,
        scheduledAt,
        interviewerName,
        mode,
        status,
        score,
        feedback,
        createdAt,
        updatedAt
      `)
      .single();

    if (interviewError) {
      console.error(
        "Interview creation error:",
        interviewError,
      );

      return NextResponse.json(
        {
          error: "Unable to create interview.",
          details:
            process.env.NODE_ENV === "development"
              ? interviewError.message
              : undefined,
        },
        { status: 500 },
      );
    }

    /*
     * 4. Move application into interview stage.
     */
    const { error: applicationUpdateError } = await supabase
      .from("Application")
      .update({
        status: "INTERVIEW_SCHEDULED",
        updatedAt: new Date().toISOString(),
      })
      .eq("id", applicationId);

    if (applicationUpdateError) {
      console.error(
        "Application interview status update error:",
        applicationUpdateError,
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Interview scheduled successfully.",
        interview,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Interview POST error:", error);

    return NextResponse.json(
      {
        error: "Unable to schedule interview.",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
      },
      { status: 500 },
    );
  }
}
