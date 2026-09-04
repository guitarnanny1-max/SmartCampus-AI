import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

async function getAuthContext() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !publishableKey || !serviceRoleKey) {
    return {
      error: NextResponse.json(
        { error: "Supabase environment is not configured." },
        { status: 500 },
      ),
    };
  }

  const cookieStore = await cookies();

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
            // Request cookies may be read-only.
          }
        },
      },
    },
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
        { status: 401 },
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
    },
  );

  const { data: appUser, error: userError } =
    await supabaseAdmin
      .from("User")
      .select(
        `
          id,
          "tenantId",
          email,
          name,
          role
        `,
      )
      .eq("email", authUser.email)
      .maybeSingle();

  if (userError) {
    console.error(
      "Student enrollment User lookup error:",
      userError,
    );

    return {
      error: NextResponse.json(
        { error: "Unable to load application user." },
        { status: 500 },
      ),
    };
  }

  if (!appUser?.tenantId) {
    return {
      error: NextResponse.json(
        { error: "Application user has no tenant." },
        { status: 403 },
      ),
    };
  }

  return {
    supabaseAdmin,
    tenantId: appUser.tenantId,
    appUser,
  };
}

/*
 * ============================================================
 * GET — LIST STUDENT ENROLLMENTS
 * ============================================================
 */

export async function GET(request: Request) {
  try {
    const context = await getAuthContext();

    if ("error" in context) {
      return context.error;
    }

    const { supabaseAdmin, tenantId } = context;
    const url = new URL(request.url);

    const studentId =
      (url.searchParams.get("student_id") || "").trim();

    const academicYearId =
      (url.searchParams.get("academic_year_id") || "").trim();

    const classId =
      (url.searchParams.get("class_id") || "").trim();

    const sectionId =
      (url.searchParams.get("section_id") || "").trim();

    let query = supabaseAdmin
      .from("student_enrollments")
      .select(
        `
          id,
          "tenantId",
          student_id,
          academic_year_id,
          class_id,
          section_id,
          roll_number,
          status,
          enrolled_at,
          created_at,
          updated_at
        `,
      )
      .eq("tenantId", tenantId)
      .order("created_at", { ascending: false });

    if (studentId) {
      query = query.eq("student_id", studentId);
    }

    if (academicYearId) {
      query = query.eq(
        "academic_year_id",
        academicYearId,
      );
    }

    if (classId) {
      query = query.eq("class_id", classId);
    }

    if (sectionId) {
      query = query.eq("section_id", sectionId);
    }

    const { data, error } = await query;

    if (error) {
      console.error(
        "Student enrollments GET error:",
        error,
      );

      return NextResponse.json(
        {
          error: "Unable to load student enrollments.",
          details:
            process.env.NODE_ENV === "development"
              ? {
                  message: error.message,
                  code: error.code,
                  details: error.details,
                  hint: error.hint,
                }
              : undefined,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      enrollments: data ?? [],
      total: data?.length ?? 0,
    });
  } catch (error) {
    console.error(
      "GET /api/student-enrollments error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load student enrollments.",
      },
      { status: 500 },
    );
  }
}

/*
 * ============================================================
 * POST — CREATE STUDENT ENROLLMENT
 * ============================================================
 */

export async function POST(request: Request) {
  try {
    const context = await getAuthContext();

    if ("error" in context) {
      return context.error;
    }

    const { supabaseAdmin, tenantId } = context;

    let body: Record<string, unknown>;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400 },
      );
    }

    const studentId =
      typeof body.student_id === "string"
        ? body.student_id.trim()
        : "";

    const academicYearId =
      typeof body.academic_year_id === "string"
        ? body.academic_year_id.trim()
        : "";

    const classId =
      typeof body.class_id === "string"
        ? body.class_id.trim()
        : "";

    const sectionId =
      typeof body.section_id === "string"
        ? body.section_id.trim()
        : "";

    const rollNumber =
      typeof body.roll_number === "string"
        ? body.roll_number.trim() || null
        : null;

    const status =
      typeof body.status === "string"
        ? body.status.trim().toUpperCase()
        : "ACTIVE";

    const enrolledAt =
      typeof body.enrolled_at === "string"
        ? body.enrolled_at.trim() || null
        : null;

    if (
      !studentId ||
      !academicYearId ||
      !classId ||
      !sectionId
    ) {
      return NextResponse.json(
        {
          error:
            "student_id, academic_year_id, class_id and section_id are required.",
        },
        { status: 400 },
      );
    }

    if (!["ACTIVE", "INACTIVE", "COMPLETED"].includes(status)) {
      return NextResponse.json(
        {
          error:
            "Invalid enrollment status.",
        },
        { status: 400 },
      );
    }

    /*
     * Verify student belongs to this tenant.
     */
    const { data: student, error: studentError } =
      await supabaseAdmin
        .from("Student")
        .select('id, "tenantId", name, "rollNumber", status')
        .eq("id", studentId)
        .eq("tenantId", tenantId)
        .maybeSingle();

    if (studentError) {
      console.error(
        "Student enrollment student lookup error:",
        studentError,
      );

      return NextResponse.json(
        { error: "Unable to validate student." },
        { status: 500 },
      );
    }

    if (!student) {
      return NextResponse.json(
        {
          error:
            "Student not found for the current tenant.",
        },
        { status: 404 },
      );
    }

    /*
     * Verify academic year belongs to this tenant.
     */
    const { data: academicYear, error: yearError } =
      await supabaseAdmin
        .from("academic_years")
        .select(
          'id, "tenantId", name, status',
        )
        .eq("id", academicYearId)
        .eq("tenantId", tenantId)
        .maybeSingle();

    if (yearError) {
      console.error(
        "Student enrollment academic year lookup error:",
        yearError,
      );

      return NextResponse.json(
        { error: "Unable to validate academic year." },
        { status: 500 },
      );
    }

    if (!academicYear) {
      return NextResponse.json(
        {
          error:
            "Academic year not found for the current tenant.",
        },
        { status: 404 },
      );
    }

    /*
     * Verify class belongs to this tenant and year.
     */
    const { data: classRow, error: classError } =
      await supabaseAdmin
        .from("classes")
        .select(
          'id, "tenantId", academic_year_id, name, status',
        )
        .eq("id", classId)
        .eq("tenantId", tenantId)
        .eq("academic_year_id", academicYearId)
        .maybeSingle();

    if (classError) {
      console.error(
        "Student enrollment class lookup error:",
        classError,
      );

      return NextResponse.json(
        { error: "Unable to validate class." },
        { status: 500 },
      );
    }

    if (!classRow) {
      return NextResponse.json(
        {
          error:
            "Class not found for the selected academic year.",
        },
        { status: 404 },
      );
    }

    /*
     * Verify section belongs to the selected class.
     */
    const { data: section, error: sectionError } =
      await supabaseAdmin
        .from("sections")
        .select(
          'id, "tenantId", class_id, name, status',
        )
        .eq("id", sectionId)
        .eq("tenantId", tenantId)
        .eq("class_id", classId)
        .maybeSingle();

    if (sectionError) {
      console.error(
        "Student enrollment section lookup error:",
        sectionError,
      );

      return NextResponse.json(
        { error: "Unable to validate section." },
        { status: 500 },
      );
    }

    if (!section) {
      return NextResponse.json(
        {
          error:
            "Section not found for the selected class.",
        },
        { status: 404 },
      );
    }

    /*
     * Create enrollment.
     */
    const id = crypto.randomUUID();

    const { data, error } = await supabaseAdmin
      .from("student_enrollments")
      .insert({
        id,
        tenantId,
        student_id: studentId,
        academic_year_id: academicYearId,
        class_id: classId,
        section_id: sectionId,
        roll_number: rollNumber,
        status,
        enrolled_at: enrolledAt,
      })
      .select(
        `
          id,
          "tenantId",
          student_id,
          academic_year_id,
          class_id,
          section_id,
          roll_number,
          status,
          enrolled_at,
          created_at,
          updated_at
        `,
      )
      .single();

    if (error) {
      console.error(
        "Student enrollment POST error:",
        error,
      );

      if (error.code === "23505") {
        return NextResponse.json(
          {
            error:
              "This student is already enrolled for the selected academic year.",
          },
          { status: 409 },
        );
      }

      return NextResponse.json(
        {
          error: "Unable to create student enrollment.",
          details:
            process.env.NODE_ENV === "development"
              ? {
                  message: error.message,
                  code: error.code,
                  details: error.details,
                  hint: error.hint,
                }
              : undefined,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        enrollment: data,
        student,
        academicYear,
        class: classRow,
        section,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "POST /api/student-enrollments error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create student enrollment.",
      },
      { status: 500 },
    );
  }
}
