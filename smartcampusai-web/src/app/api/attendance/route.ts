import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LATE"
  | "HALF_DAY"
  | "LEAVE";

function validDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function validStatus(
  value: string,
): value is AttendanceStatus {
  return [
    "PRESENT",
    "ABSENT",
    "LATE",
    "HALF_DAY",
    "LEAVE",
  ].includes(value);
}

async function getAuthContext() {
  const cookieStore = await cookies();

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (
    !supabaseUrl ||
    !publishableKey ||
    !serviceRoleKey
  ) {
    return {
      error: NextResponse.json(
        {
          error:
            "Supabase environment is not fully configured.",
        },
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
            cookiesToSet.forEach(
              ({ name, value, options }) => {
                cookieStore.set(name, value, options);
              },
            );
          } catch {
            // Cookies may be read-only.
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

  const {
    data: appUser,
    error: userError,
  } = await supabaseAdmin
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
      "Central attendance User lookup error:",
      userError,
    );

    return {
      error: NextResponse.json(
        {
          error:
            "Unable to load application user.",
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
          error:
            "Application user has no tenant.",
        },
        { status: 403 },
      ),
    };
  }

  return {
    supabaseAdmin,
    tenantId: appUser.tenantId,
  };
}

export async function GET(request: Request) {
  try {
    const context = await getAuthContext();

    if ("error" in context) {
      return context.error;
    }

    const {
      supabaseAdmin,
      tenantId,
    } = context;

    const url = new URL(request.url);

    const date = (
      url.searchParams.get("date") || ""
    ).trim();

    const from = (
      url.searchParams.get("from") || ""
    ).trim();

    const to = (
      url.searchParams.get("to") || ""
    ).trim();

    const status = (
      url.searchParams.get("status") || ""
    )
      .trim()
      .toUpperCase();

    const teacherId = (
      url.searchParams.get("teacher_id") || ""
    ).trim();

    if (date && !validDate(date)) {
      return NextResponse.json(
        {
          error:
            "Invalid date. Use YYYY-MM-DD.",
        },
        { status: 400 },
      );
    }

    if (from && !validDate(from)) {
      return NextResponse.json(
        {
          error:
            "Invalid from date. Use YYYY-MM-DD.",
        },
        { status: 400 },
      );
    }

    if (to && !validDate(to)) {
      return NextResponse.json(
        {
          error:
            "Invalid to date. Use YYYY-MM-DD.",
        },
        { status: 400 },
      );
    }

    if (status && !validStatus(status)) {
      return NextResponse.json(
        {
          error:
            "Invalid status. Use PRESENT, ABSENT, LATE, HALF_DAY, or LEAVE.",
        },
        { status: 400 },
      );
    }

    /*
     * ----------------------------------------------------------
     * TEACHER ATTENDANCE
     * ----------------------------------------------------------
     *
     * Tenant filtering is mandatory.
     *
     * The existing teacher attendance API remains untouched.
     */

    let query = supabaseAdmin
      .from("teacher_attendance")
      .select(
        `
          id,
          teacher_id,
          attendance_date,
          status,
          check_in_time,
          check_out_time,
          notes,
          created_at,
          updated_at,
          "tenantId"
        `,
      )
      .eq("tenantId", tenantId)
      .order("attendance_date", {
        ascending: false,
      })
      .order("created_at", {
        ascending: false,
      });

    if (date) {
      query = query.eq(
        "attendance_date",
        date,
      );
    }

    if (from) {
      query = query.gte(
        "attendance_date",
        from,
      );
    }

    if (to) {
      query = query.lte(
        "attendance_date",
        to,
      );
    }

    if (status) {
      query = query.eq("status", status);
    }

    if (teacherId) {
      query = query.eq(
        "teacher_id",
        teacherId,
      );
    }

    const {
      data: attendance,
      error: attendanceError,
    } = await query;

    if (attendanceError) {
      console.error(
        "Central teacher attendance query error:",
        attendanceError,
      );

      return NextResponse.json(
        {
          error: attendanceError.message,
        },
        { status: 500 },
      );
    }

    /*
     * ----------------------------------------------------------
     * LOAD TEACHERS
     * ----------------------------------------------------------
     */

    const teacherIds = Array.from(
      new Set(
        (attendance ?? []).map(
          (item) => item.teacher_id,
        ),
      ),
    );

    let teachers: Array<{
      id: string;
      employee_id: string | null;
      name: string | null;
      role: string | null;
      status: string | null;
      tenantId: string | null;
    }> = [];

    if (teacherIds.length > 0) {
      const {
        data,
        error,
      } = await supabaseAdmin
        .from("Staff")
        .select(
          `
            id,
            employee_id,
            name,
            role,
            status,
            "tenantId"
          `,
        )
        .eq("tenantId", tenantId)
        .eq("role", "Teacher")
        .in("id", teacherIds);

      if (error) {
        console.error(
          "Central teacher lookup error:",
          error,
        );

        return NextResponse.json(
          {
            error: error.message,
          },
          { status: 500 },
        );
      }

      teachers = data ?? [];
    }

    const teacherMap = new Map(
      teachers.map((teacher) => [
        teacher.id,
        teacher,
      ]),
    );

    const teacherRecords = (attendance ?? []).map(
      (item) => {
        const teacher = teacherMap.get(
          item.teacher_id,
        );

        return {
          id: item.id,
          personId: item.teacher_id,
          personName:
            teacher?.name ||
            teacher?.employee_id ||
            item.teacher_id,
          employeeId:
            teacher?.employee_id || null,
          role: "Teacher" as const,
          date: item.attendance_date,
          status: item.status as AttendanceStatus,
          checkIn: item.check_in_time,
          checkOut: item.check_out_time,
          notes: item.notes,
          tenantId: item.tenantId,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        };
      },
    );

    /*
     * Student attendance comes from the existing Attendance table.
     * Tenant isolation and the existing teacher attendance flow
     * remain unchanged.
     */
    let studentQuery = supabaseAdmin
      .from("Attendance")
      .select(
        `
          id,
          "tenantId",
          "studentId",
          "studentName",
          date,
          status,
          "punchTime",
          "createdAt"
        `,
      )
      .eq("tenantId", tenantId)
      .order("date", { ascending: false })
      .order("createdAt", { ascending: false });

    if (date) {
      studentQuery = studentQuery.eq("date", date);
    }

    if (from) {
      studentQuery = studentQuery.gte("date", from);
    }

    if (to) {
      studentQuery = studentQuery.lte("date", to);
    }

    if (status) {
      studentQuery = studentQuery.eq("status", status);
    }

    const {
      data: studentAttendance,
      error: studentAttendanceError,
    } = await studentQuery;

    if (studentAttendanceError) {
      console.error(
        "Central student attendance query error:",
        studentAttendanceError,
      );

      return NextResponse.json(
        {
          error:
            process.env.NODE_ENV === "development"
              ? studentAttendanceError.message
              : "Unable to load student attendance.",
        },
        { status: 500 },
      );
    }

    const studentRecords = (studentAttendance ?? []).map(
      (item) => ({
        id: item.id,
        personId: item.studentId,
        personName: item.studentName,
        employeeId: null,
        role: "Student" as const,
        date: item.date,
        status: item.status as AttendanceStatus,
        checkIn: item.punchTime,
        checkOut: null,
        notes: null,
        tenantId: item.tenantId,
        createdAt: item.createdAt,
        updatedAt: null,
      }),
    );

    const records = [
      ...teacherRecords,
      ...studentRecords,
    ].sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);

      if (dateCompare !== 0) {
        return dateCompare;
      }

      return (b.createdAt || "").localeCompare(
        a.createdAt || "",
      );
    });

    const total = records.length;

    const present = records.filter(
      (item) => item.status === "PRESENT",
    ).length;

    const absent = records.filter(
      (item) => item.status === "ABSENT",
    ).length;

    const late = records.filter(
      (item) => item.status === "LATE",
    ).length;

    const halfDay = records.filter(
      (item) => item.status === "HALF_DAY",
    ).length;

    const leave = records.filter(
      (item) => item.status === "LEAVE",
    ).length;

    const attendanceRate =
      total > 0
        ? Math.round((present / total) * 100)
        : 0;

    return NextResponse.json({
      date: date || null,
      from: from || null,
      to: to || null,
      role: "ALL",
      tenantId,
      summary: {
        total,
        present,
        absent,
        late,
        halfDay,
        leave,
        attendanceRate,
      },
      records,
    });
  } catch (error) {
    console.error(
      "Central attendance GET error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load attendance.",
      },
      { status: 500 },
    );
  }
}
