import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

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
        { error: "Supabase environment is not fully configured." },
        { status: 500 },
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
    },
  );

  const {
    data: { user: authUser },
    error: authError,
  } = await supabaseAuth.auth.getUser();

  if (authError || !authUser?.email) {
    console.error("Student API authentication error:", authError);

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
      "Student API User lookup error:",
      userError,
    );

    return {
      error: NextResponse.json(
        {
          error: "Unable to load application user.",
          details:
            process.env.NODE_ENV === "development"
              ? userError.message
              : undefined,
        },
        { status: 500 },
      ),
    };
  }

  if (!appUser) {
    return {
      error: NextResponse.json(
        {
          error:
            "Authenticated user has no application User record.",
        },
        { status: 403 },
      ),
    };
  }

  if (!appUser.tenantId) {
    return {
      error: NextResponse.json(
        {
          error: "Application user has no tenant.",
        },
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
 * GET STUDENTS
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
    const search = (url.searchParams.get("search") || "").trim();

    /*
     * ------------------------------------------------------------
     * 1. Load students
     * ------------------------------------------------------------
     */
    let studentQuery = supabaseAdmin
      .from("Student")
      .select(`
        id,
        "tenantId",
        name,
        "rollNumber",
        grade,
        "parentEmail",
        status,
        "createdAt"
      `)
      .eq("tenantId", tenantId)
      .order("createdAt", {
        ascending: false,
      });

    if (search) {
      studentQuery = studentQuery.or(
        `name.ilike.%${search}%,rollNumber.ilike.%${search}%,grade.ilike.%${search}%,parentEmail.ilike.%${search}%`,
      );
    }

    const {
      data: students,
      error: studentError,
    } = await studentQuery;

    if (studentError) {
      console.error(
        "STUDENT DATABASE FAILURE:",
        studentError,
      );

      return NextResponse.json(
        {
          error: "Unable to load students.",
          details:
            process.env.NODE_ENV === "development"
              ? studentError.message
              : undefined,
        },
        { status: 500 },
      );
    }

    if (!students || students.length === 0) {
      return NextResponse.json({
        success: true,
        students: [],
        total: 0,
      });
    }

    /*
     * ------------------------------------------------------------
     * 2. Load enrollments for this tenant
     *
     * Avoid N+1 requests by loading all enrollment records
     * in one query.
     * ------------------------------------------------------------
     */
    const { data: enrollments, error: enrollmentError } =
      await supabaseAdmin
        .from("student_enrollments")
        .select(`
          id,
          "tenantId",
          student_id,
          academic_year_id,
          class_id,
          section_id,
          roll_number,
          status,
          enrolled_at
        `)
        .eq("tenantId", tenantId)
        .order("created_at", {
          ascending: false,
        });

    if (enrollmentError) {
      console.error(
        "STUDENT ENROLLMENT DATABASE FAILURE:",
        enrollmentError,
      );

      return NextResponse.json(
        {
          error: "Unable to load student enrollments.",
          details:
            process.env.NODE_ENV === "development"
              ? enrollmentError.message
              : undefined,
        },
        { status: 500 },
      );
    }

    /*
     * ------------------------------------------------------------
     * 3. Load classes
     * ------------------------------------------------------------
     */
    const { data: classes, error: classError } =
      await supabaseAdmin
        .from("classes")
        .select(`
          id,
          academic_year_id,
          name,
          status
        `)
        .eq("tenantId", tenantId);

    if (classError) {
      console.error(
        "STUDENT CLASS DATABASE FAILURE:",
        classError,
      );

      return NextResponse.json(
        {
          error: "Unable to load classes.",
          details:
            process.env.NODE_ENV === "development"
              ? classError.message
              : undefined,
        },
        { status: 500 },
      );
    }

    /*
     * ------------------------------------------------------------
     * 4. Load sections
     * ------------------------------------------------------------
     */
    const { data: sections, error: sectionError } =
      await supabaseAdmin
        .from("sections")
        .select(`
          id,
          class_id,
          name
        `)
        .eq("tenantId", tenantId);

    if (sectionError) {
      console.error(
        "STUDENT SECTION DATABASE FAILURE:",
        sectionError,
      );

      return NextResponse.json(
        {
          error: "Unable to load sections.",
          details:
            process.env.NODE_ENV === "development"
              ? sectionError.message
              : undefined,
        },
        { status: 500 },
      );
    }

    /*
     * ------------------------------------------------------------
     * 5. Load academic years
     * ------------------------------------------------------------
     */
    const { data: academicYears, error: academicYearError } =
      await supabaseAdmin
        .from("academic_years")
        .select(`
          id,
          "tenantId",
          name,
          status
        `)
        .eq("tenantId", tenantId);

    if (academicYearError) {
      console.error(
        "STUDENT ACADEMIC YEAR DATABASE FAILURE:",
        academicYearError,
      );

      return NextResponse.json(
        {
          error: "Unable to load academic years.",
          details:
            process.env.NODE_ENV === "development"
              ? academicYearError.message
              : undefined,
        },
        { status: 500 },
      );
    }

    /*
     * ------------------------------------------------------------
     * 6. Build lookup maps
     * ------------------------------------------------------------
     */
    const classMap = new Map(
      (classes ?? []).map((item) => [
        item.id,
        item,
      ]),
    );

    const sectionMap = new Map(
      (sections ?? []).map((item) => [
        item.id,
        item,
      ]),
    );

    const academicYearMap = new Map(
      (academicYears ?? []).map((item) => [
        item.id,
        item,
      ]),
    );

    /*
     * ------------------------------------------------------------
     * 7. Pick the active enrollment for each student.
     *
     * ACTIVE enrollment wins. Otherwise use the newest
     * enrollment record.
     * ------------------------------------------------------------
     */
    const enrollmentMap = new Map<string, any>();

    for (const enrollment of enrollments ?? []) {
      const existing = enrollmentMap.get(
        enrollment.student_id,
      );

      if (
        !existing ||
        (
          enrollment.status === "ACTIVE" &&
          existing.status !== "ACTIVE"
        )
      ) {
        enrollmentMap.set(
          enrollment.student_id,
          enrollment,
        );
      }
    }

    /*
     * ------------------------------------------------------------
     * 8. Merge Student + Enrollment + Class + Section +
     *    Academic Year.
     * ------------------------------------------------------------
     */
    const enrichedStudents = students.map((student) => {
      const enrollment = enrollmentMap.get(student.id);

      if (!enrollment) {
        return {
          ...student,
          enrollment: null,
          academicYear: null,
          class: null,
          section: null,
        };
      }

      const classRow = classMap.get(
        enrollment.class_id,
      );

      const sectionRow = sectionMap.get(
        enrollment.section_id,
      );

      const academicYear = academicYearMap.get(
        enrollment.academic_year_id,
      );

      return {
        ...student,

        /*
         * Keep legacy Student fields for compatibility.
         * Enrollment is authoritative for current academic data.
         */
        rollNumber:
          enrollment.roll_number ||
          student.rollNumber,

        grade:
          classRow?.name ||
          student.grade,

        enrollment: {
          id: enrollment.id,
          academic_year_id:
            enrollment.academic_year_id,
          class_id:
            enrollment.class_id,
          section_id:
            enrollment.section_id,
          roll_number:
            enrollment.roll_number,
          status:
            enrollment.status,
          enrolled_at:
            enrollment.enrolled_at,
        },

        academicYear: academicYear
          ? {
              id: academicYear.id,
              name: academicYear.name,
              status: academicYear.status,
            }
          : null,

        class: classRow
          ? {
              id: classRow.id,
              name: classRow.name,
              academic_year_id:
                classRow.academic_year_id,
              status: classRow.status,
            }
          : null,

        section: sectionRow
          ? {
              id: sectionRow.id,
              name: sectionRow.name,
              class_id: sectionRow.class_id,
            }
          : null,
      };
    });

    return NextResponse.json({
      success: true,
      students: enrichedStudents,
      total: enrichedStudents.length,
    });
  } catch (error) {
    console.error("GET /api/students error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load students.",
      },
      { status: 500 },
    );
  }
}

/*
 * ============================================================
 * POST — CREATE STUDENT
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
        {
          error: "Invalid JSON request body.",
        },
        { status: 400 },
      );
    }

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const rollNumber =
      typeof body.rollNumber === "string"
        ? body.rollNumber.trim()
        : "";

    const grade =
      typeof body.grade === "string"
        ? body.grade.trim()
        : "";

    const parentEmail =
      typeof body.parentEmail === "string"
        ? body.parentEmail.trim()
        : "";

    if (!name) {
      return NextResponse.json(
        {
          error: "Student name is required.",
        },
        { status: 400 },
      );
    }

    const studentId =
      `student_${crypto.randomUUID()}`;

    console.log(
      "CREATING STUDENT:",
      {
        studentId,
        tenantId,
        name,
        rollNumber,
        grade,
      },
    );

    const {
      data: student,
      error: studentError,
    } = await supabaseAdmin
      .from("Student")
      .insert({
        id: studentId,
        tenantId,
        name,
        rollNumber,
        grade,
        parentEmail,
        status: "ACTIVE",
      })
      .select(
        `
          id,
          "tenantId",
          name,
          "rollNumber",
          grade,
          "parentEmail",
          status,
          "createdAt"
        `,
      )
      .single();

    if (studentError) {
      console.error(
        "STUDENT CREATION FAILURE:",
        studentError,
      );

      return NextResponse.json(
        {
          error: "Unable to create student.",
          details:
            process.env.NODE_ENV === "development"
              ? studentError.message
              : undefined,
        },
        { status: 500 },
      );
    }

    console.log(
      "STUDENT CREATED SUCCESSFULLY:",
      student.id,
    );

    return NextResponse.json(
      {
        success: true,
        student,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "POST /api/students error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create student.",
      },
      { status: 500 },
    );
  }
}
