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

function cleanNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return null;
  }

  return number;
}

function createAssessmentId() {
  return `assessment_${crypto.randomUUID()}`;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const { searchParams } = new URL(request.url);

    const applicationId = cleanString(searchParams.get("applicationId"));
    const status = cleanString(searchParams.get("status"));
    const assessmentType = cleanString(
      searchParams.get("assessmentType"),
    );

    let query = supabase
      .from("Assessment")
      .select(`
        id,
        applicationId,
        assessmentType,
        scheduledAt,
        status,
        score,
        maxscore,
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

    if (assessmentType) {
      query = query.eq("assessmentType", assessmentType);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Assessment list error:", error);

      return NextResponse.json(
        {
          error: "Unable to load assessments.",
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
      assessments: data ?? [],
      count: data?.length ?? 0,
    });
  } catch (error) {
    console.error("Assessment GET error:", error);

    return NextResponse.json(
      {
        error: "Unable to load assessments.",
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
    const assessmentType = cleanString(body.assessmentType);
    const scheduledAt = cleanDateTime(body.scheduledAt);
    const score = cleanNumber(body.score);
    const maxscore = cleanNumber(body.maxscore);
    const feedback = cleanString(body.feedback);

    if (!applicationId) {
      return NextResponse.json(
        {
          error: "Application ID is required.",
        },
        { status: 400 },
      );
    }

    if (!assessmentType) {
      return NextResponse.json(
        {
          error: "Assessment type is required.",
        },
        { status: 400 },
      );
    }

    if (score !== null && score < 0) {
      return NextResponse.json(
        {
          error: "Assessment score cannot be negative.",
        },
        { status: 400 },
      );
    }

    if (maxscore !== null && maxscore <= 0) {
      return NextResponse.json(
        {
          error: "Maximum score must be greater than zero.",
        },
        { status: 400 },
      );
    }

    if (
      score !== null &&
      maxscore !== null &&
      score > maxscore
    ) {
      return NextResponse.json(
        {
          error: "Assessment score cannot exceed maximum score.",
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
        "Assessment application verification error:",
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
     * 2. Prevent duplicate active assessment of the
     *    same type for this application.
     */
    const { data: existingAssessment, error: duplicateError } =
      await supabase
        .from("Assessment")
        .select(`
          id,
          applicationId,
          assessmentType,
          scheduledAt,
          status,
          score,
          maxscore,
          feedback
        `)
        .eq("applicationId", applicationId)
        .eq("assessmentType", assessmentType)
        .in("status", ["SCHEDULED", "COMPLETED"])
        .maybeSingle();

    if (duplicateError) {
      console.error(
        "Assessment duplicate check error:",
        duplicateError,
      );

      return NextResponse.json(
        {
          error: "Unable to check existing assessment.",
          details:
            process.env.NODE_ENV === "development"
              ? duplicateError.message
              : undefined,
        },
        { status: 500 },
      );
    }

    if (existingAssessment) {
      return NextResponse.json(
        {
          error:
            "An assessment of this type already exists for this application.",
          assessment: existingAssessment,
        },
        { status: 409 },
      );
    }

    /*
     * 3. Create assessment.
     */
    const assessmentId = createAssessmentId();

    const { data: assessment, error: assessmentError } = await supabase
      .from("Assessment")
      .insert({
        id: assessmentId,
        applicationId,
        assessmentType,
        scheduledAt,
        status: "SCHEDULED",
        score,
        maxscore,
        feedback,
      })
      .select(`
        id,
        applicationId,
        assessmentType,
        scheduledAt,
        status,
        score,
        maxscore,
        feedback,
        createdAt,
        updatedAt
      `)
      .single();

    if (assessmentError) {
      console.error(
        "Assessment creation error:",
        assessmentError,
      );

      return NextResponse.json(
        {
          error: "Unable to create assessment.",
          details:
            process.env.NODE_ENV === "development"
              ? assessmentError.message
              : undefined,
        },
        { status: 500 },
      );
    }

    /*
     * 4. Move application into assessment stage.
     */
    const { error: applicationUpdateError } = await supabase
      .from("Application")
      .update({
        status: "ASSESSMENT_SCHEDULED",
        updatedAt: new Date().toISOString(),
      })
      .eq("id", applicationId);

    if (applicationUpdateError) {
      console.error(
        "Application assessment status update error:",
        applicationUpdateError,
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Assessment scheduled successfully.",
        assessment,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Assessment POST error:", error);

    return NextResponse.json(
      {
        error: "Unable to create assessment.",
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
