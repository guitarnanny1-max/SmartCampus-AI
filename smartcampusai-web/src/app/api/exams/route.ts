import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

async function getAuthContext() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !publishableKey || !serviceRoleKey) {
    return {
      error: NextResponse.json(
        { error: "Supabase configuration is incomplete." },
        { status: 500 }
      ),
    };
  }

  const supabaseAuth = createServerClient(
    supabaseUrl,
    publishableKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Cookies may be read-only in this request context.
          }
        },
      },
    }
  );

  const {
    data: { user: authUser },
    error: authError,
  } = await supabaseAuth.auth.getUser();

  if (authError || !authUser?.email) {
    return {
      error: NextResponse.json(
        {
          authenticated: false,
          error: "Authentication required.",
        },
        { status: 401 }
      ),
    };
  }

  const supabaseAdmin = createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  const { data: appUser, error: userError } =
    await supabaseAdmin
      .from("User")
      .select("id, tenantId, email, name, role")
      .eq("email", authUser.email)
      .maybeSingle();

  if (userError) {
    console.error("Exams User lookup error:", userError);

    return {
      error: NextResponse.json(
        { error: "Unable to load application user." },
        { status: 500 }
      ),
    };
  }

  if (!appUser?.tenantId) {
    return {
      error: NextResponse.json(
        { error: "Application user has no tenant." },
        { status: 403 }
      ),
    };
  }

  return {
    supabaseAdmin,
    tenantId: appUser.tenantId as string,
    appUser,
  };
}

function cleanString(value: unknown): string {
  return String(value ?? "").trim();
}

function cleanOptionalString(value: unknown): string | null {
  const valueString = cleanString(value);
  return valueString || null;
}

function isValidDate(value: string | null): boolean {
  if (!value) return true;
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isValidStatus(value: string): boolean {
  return [
    "DRAFT",
    "SCHEDULED",
    "PUBLISHED",
    "COMPLETED",
    "CANCELLED",
  ].includes(value);
}

export async function GET() {
  try {
    const context = await getAuthContext();

    if ("error" in context) {
      return context.error;
    }

    const { supabaseAdmin, tenantId } = context;

    const { data, error } = await supabaseAdmin
      .from("exams")
      .select(
        `
        id,
        "tenantId",
        academic_year_id,
        name,
        exam_type,
        start_date,
        end_date,
        status,
        created_at,
        updated_at
        `
      )
      .eq("tenantId", tenantId)
      .order("start_date", {
        ascending: false,
        nullsFirst: false,
      })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Exams GET error:", error);

      return NextResponse.json(
        {
          success: false,
          error: "Unable to load exams.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      exams: data ?? [],
      total: data?.length ?? 0,
    });
  } catch (error) {
    console.error("Exams GET exception:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load exams.",
        details:
          error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const context = await getAuthContext();

    if ("error" in context) {
      return context.error;
    }

    const { supabaseAdmin, tenantId } = context;

    const body = await request.json();

    const name = cleanString(body.name);

    const examType =
      cleanString(body.exam_type || body.examType) || "EXAM";

    const academicYearId = cleanString(
      body.academic_year_id || body.academicYearId
    );

    const startDate = cleanOptionalString(
      body.start_date || body.startDate
    );

    const endDate = cleanOptionalString(
      body.end_date || body.endDate
    );

    const status =
      cleanString(body.status || "DRAFT").toUpperCase() || "DRAFT";

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: "Exam name is required.",
        },
        { status: 400 }
      );
    }

    if (!academicYearId) {
      return NextResponse.json(
        {
          success: false,
          error: "Academic year is required.",
        },
        { status: 400 }
      );
    }

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      return NextResponse.json(
        {
          success: false,
          error: "Dates must use YYYY-MM-DD format.",
        },
        { status: 400 }
      );
    }

    if (
      startDate &&
      endDate &&
      new Date(endDate).getTime() <
        new Date(startDate).getTime()
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "End date cannot be before start date.",
        },
        { status: 400 }
      );
    }

    if (!isValidStatus(status)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid exam status.",
        },
        { status: 400 }
      );
    }

    const { data: academicYear, error: academicYearError } =
      await supabaseAdmin
        .from("academic_years")
        .select('id, "tenantId", name, status')
        .eq("id", academicYearId)
        .eq("tenantId", tenantId)
        .maybeSingle();

    if (academicYearError) {
      console.error(
        "Academic year lookup error:",
        academicYearError
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to validate academic year.",
          details: academicYearError.message,
        },
        { status: 500 }
      );
    }

    if (!academicYear) {
      return NextResponse.json(
        {
          success: false,
          error: "Academic year was not found.",
        },
        { status: 400 }
      );
    }

    const { data: existingExam, error: existingExamError } =
      await supabaseAdmin
        .from("exams")
        .select("id")
        .eq("tenantId", tenantId)
        .eq("academic_year_id", academicYearId)
        .ilike("name", name)
        .maybeSingle();

    if (existingExamError) {
      console.error(
        "Existing exam lookup error:",
        existingExamError
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to check existing exams.",
          details: existingExamError.message,
        },
        { status: 500 }
      );
    }

    if (existingExam) {
      return NextResponse.json(
        {
          success: false,
          error:
            "An exam with this name already exists for this academic year.",
          exam_id: existingExam.id,
        },
        { status: 409 }
      );
    }

    const examId = `exam_${crypto.randomUUID()}`;

    const { data: exam, error: examError } =
      await supabaseAdmin
        .from("exams")
        .insert({
          id: examId,
          tenantId,
          academic_year_id: academicYearId,
          name,
          exam_type: examType,
          start_date: startDate,
          end_date: endDate,
          status,
        })
        .select(
          `
          id,
          "tenantId",
          academic_year_id,
          name,
          exam_type,
          start_date,
          end_date,
          status,
          created_at,
          updated_at
          `
        )
        .single();

    if (examError) {
      console.error("Exam create error:", examError);

      return NextResponse.json(
        {
          success: false,
          error: "Unable to create exam.",
          details: examError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        exam,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Exams POST exception:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to create exam.",
        details:
          error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
