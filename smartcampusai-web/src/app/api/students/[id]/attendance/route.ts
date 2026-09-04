import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LATE"
  | "HALF_DAY"
  | "LEAVE";

const VALID_STATUSES: readonly AttendanceStatus[] = [
  "PRESENT",
  "ABSENT",
  "LATE",
  "HALF_DAY",
  "LEAVE",
];

type AuthContext = {
  supabaseAdmin: SupabaseClient;
  tenantId: string;
};

function validDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function validStatus(
  value: string,
): value is AttendanceStatus {
  return VALID_STATUSES.includes(
    value as AttendanceStatus,
  );
}

function normalizeTime(value: unknown): string | null {
  const result = String(value ?? "").trim();

  if (!result) {
    return null;
  }

  if (/^\d{2}:\d{2}$/.test(result)) {
    return `${result}:00`;
  }

  if (/^\d{2}:\d{2}:\d{2}$/.test(result)) {
    return result;
  }

  return null;
}

async function getAuthContext(): Promise<
  AuthContext | { error: NextResponse }
> {
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
                cookieStore.set(
                  name,
                  value,
                  options,
                );
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
      "Student attendance User lookup error:",
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

async function getStudent(
  supabaseAdmin: SupabaseClient,
  tenantId: string,
  studentId: string,
) {
  const { data, error } = await supabaseAdmin
    .from("Student")
    .select(
      `
        id,
        "tenantId",
        name,
        "rollNumber",
        grade,
        status
      `,
    )
    .eq("id", studentId)
    .eq("tenantId", tenantId)
    .maybeSingle();

  if (error) {
    console.error(
      "Student attendance student lookup error:",
      error,
    );

    return {
      error: NextResponse.json(
        {
          error: "Unable to load student.",
        },
        { status: 500 },
      ),
    };
  }

  if (!data) {
    return {
      error: NextResponse.json(
        {
          error: "Student not found.",
        },
        { status: 404 },
      ),
    };
  }

  return { student: data };
}

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: Request,
  context: RouteContext,
) {
  try {
    const authContext = await getAuthContext();

    if ("error" in authContext) {
      return authContext.error;
    }

    const {
      supabaseAdmin,
      tenantId,
    } = authContext;

    const { id: studentId } = await context.params;

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required." },
        { status: 400 },
      );
    }

    const studentResult = await getStudent(
      supabaseAdmin,
      tenantId,
      studentId,
    );

    if ("error" in studentResult) {
      return studentResult.error;
    }

    const url = new URL(request.url);
    const from =
      url.searchParams.get("from")?.trim() || "";
    const to =
      url.searchParams.get("to")?.trim() || "";
    const date =
      url.searchParams.get("date")?.trim() || "";

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

    let query = supabaseAdmin
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
      .eq("studentId", studentId)
      .order("date", { ascending: false });

    if (date) {
      query = query.eq("date", date);
    }

    if (from) {
      query = query.gte("date", from);
    }

    if (to) {
      query = query.lte("date", to);
    }

    const {
      data: records,
      error,
    } = await query;

    if (error) {
      console.error(
        "Student attendance GET error:",
        error,
      );

      return NextResponse.json(
        {
          error:
            process.env.NODE_ENV === "development"
              ? `Unable to load student attendance: ${error.message}`
              : "Unable to load student attendance.",
        },
        { status: 500 },
      );
    }

    const attendance = records ?? [];

    const total = attendance.length;
    const present = attendance.filter(
      (item) => item.status === "PRESENT",
    ).length;
    const absent = attendance.filter(
      (item) => item.status === "ABSENT",
    ).length;
    const late = attendance.filter(
      (item) => item.status === "LATE",
    ).length;
    const halfDay = attendance.filter(
      (item) => item.status === "HALF_DAY",
    ).length;
    const leave = attendance.filter(
      (item) => item.status === "LEAVE",
    ).length;

    const attendanceRate =
      total > 0
        ? Math.round((present / total) * 100)
        : 0;

    return NextResponse.json({
      student: studentResult.student,
      summary: {
        total,
        present,
        absent,
        late,
        halfDay,
        leave,
        attendanceRate,
      },
      records: attendance,
    });
  } catch (error) {
    console.error(
      "GET /api/students/[id]/attendance error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load student attendance.",
      },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  context: RouteContext,
) {
  try {
    const authContext = await getAuthContext();

    if ("error" in authContext) {
      return authContext.error;
    }

    const {
      supabaseAdmin,
      tenantId,
    } = authContext;

    const { id: studentId } = await context.params;

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required." },
        { status: 400 },
      );
    }

    const studentResult = await getStudent(
      supabaseAdmin,
      tenantId,
      studentId,
    );

    if ("error" in studentResult) {
      return studentResult.error;
    }

    const body = await request.json();

    const attendanceDate =
      String(body.date ?? "").trim();

    const status =
      String(body.status ?? "")
        .trim()
        .toUpperCase();

    if (!validDate(attendanceDate)) {
      return NextResponse.json(
        {
          error:
            "Invalid date. Use YYYY-MM-DD.",
        },
        { status: 400 },
      );
    }

    if (!validStatus(status)) {
      return NextResponse.json(
        {
          error:
            "Invalid status. Use PRESENT, ABSENT, LATE, HALF_DAY, or LEAVE.",
        },
        { status: 400 },
      );
    }

    const punchTime =
      String(body.punchTime ?? "").trim() || null;

    const { data: existing } =
      await supabaseAdmin
        .from("Attendance")
        .select("id")
        .eq("tenantId", tenantId)
        .eq("studentId", studentId)
        .eq("date", attendanceDate)
        .maybeSingle();

    if (existing) {
      return NextResponse.json(
        {
          error:
            "Attendance already exists for this student and date.",
          attendanceId: existing.id,
        },
        { status: 409 },
      );
    }

    const { data: attendance, error } =
      await supabaseAdmin
        .from("Attendance")
        .insert({
          id: crypto.randomUUID(),
          tenantId,
          studentId,
          studentName: studentResult.student.name,
          date: attendanceDate,
          status,
          punchTime,
        })
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
        .single();

    if (error) {
      console.error(
        "Student attendance POST error:",
        error,
      );

      return NextResponse.json(
        {
          error:
            "Unable to create student attendance.",
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
        attendance,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "POST /api/students/[id]/attendance error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create student attendance.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const authContext = await getAuthContext();

    if ("error" in authContext) {
      return authContext.error;
    }

    const {
      supabaseAdmin,
      tenantId,
    } = authContext;

    const { id: studentId } = await context.params;

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required." },
        { status: 400 },
      );
    }

    const studentResult = await getStudent(
      supabaseAdmin,
      tenantId,
      studentId,
    );

    if ("error" in studentResult) {
      return studentResult.error;
    }

    const body = await request.json();
    const attendanceId =
      String(body.attendanceId ?? "").trim();

    if (!attendanceId) {
      return NextResponse.json(
        {
          error:
            "attendanceId is required.",
        },
        { status: 400 },
      );
    }

    const { data: existing, error: existingError } =
      await supabaseAdmin
        .from("Attendance")
        .select(
          `
            id,
            "studentId",
            date
          `,
        )
        .eq("id", attendanceId)
        .eq("studentId", studentId)
        .eq("tenantId", tenantId)
        .maybeSingle();

    if (existingError) {
      return NextResponse.json(
        {
          error:
            "Unable to load attendance record.",
        },
        { status: 500 },
      );
    }

    if (!existing) {
      return NextResponse.json(
        {
          error:
            "Attendance record not found.",
        },
        { status: 404 },
      );
    }

    const updates: Record<string, unknown> = {};

    if (body.date !== undefined) {
      const date =
        String(body.date ?? "").trim();

      if (!validDate(date)) {
        return NextResponse.json(
          {
            error:
              "Invalid date. Use YYYY-MM-DD.",
          },
          { status: 400 },
        );
      }

      updates.date = date;
    }

    if (body.status !== undefined) {
      const status =
        String(body.status ?? "")
          .trim()
          .toUpperCase();

      if (!validStatus(status)) {
        return NextResponse.json(
          {
            error:
              "Invalid status. Use PRESENT, ABSENT, LATE, HALF_DAY, or LEAVE.",
          },
          { status: 400 },
        );
      }

      updates.status = status;
    }

    if (body.punchTime !== undefined) {
      updates.punchTime =
        String(body.punchTime ?? "").trim() ||
        null;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        {
          error: "No attendance fields to update.",
        },
        { status: 400 },
      );
    }

    const finalDate =
      typeof updates.date === "string"
        ? updates.date
        : existing.date;

    const { data: duplicate } =
      await supabaseAdmin
        .from("Attendance")
        .select("id")
        .eq("tenantId", tenantId)
        .eq("studentId", studentId)
        .eq("date", finalDate)
        .neq("id", attendanceId)
        .maybeSingle();

    if (duplicate) {
      return NextResponse.json(
        {
          error:
            "Another attendance record already exists for this student and date.",
        },
        { status: 409 },
      );
    }

    const { data: attendance, error } =
      await supabaseAdmin
        .from("Attendance")
        .update(updates)
        .eq("id", attendanceId)
        .eq("studentId", studentId)
        .eq("tenantId", tenantId)
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
        .single();

    if (error) {
      console.error(
        "Student attendance PATCH error:",
        error,
      );

      return NextResponse.json(
        {
          error:
            "Unable to update student attendance.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      attendance,
    });
  } catch (error) {
    console.error(
      "PATCH /api/students/[id]/attendance error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to update student attendance.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext,
) {
  try {
    const authContext = await getAuthContext();

    if ("error" in authContext) {
      return authContext.error;
    }

    const {
      supabaseAdmin,
      tenantId,
    } = authContext;

    const { id: studentId } = await context.params;

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required." },
        { status: 400 },
      );
    }

    await request;

    const url = new URL(request.url);
    const attendanceId =
      url.searchParams.get("attendanceId")?.trim() ||
      "";

    if (!attendanceId) {
      return NextResponse.json(
        {
          error:
            "attendanceId query parameter is required.",
        },
        { status: 400 },
      );
    }

    const { data: existing, error: existingError } =
      await supabaseAdmin
        .from("Attendance")
        .select(
          `
            id,
            date
          `,
        )
        .eq("id", attendanceId)
        .eq("studentId", studentId)
        .eq("tenantId", tenantId)
        .maybeSingle();

    if (existingError) {
      return NextResponse.json(
        {
          error:
            "Unable to load attendance record.",
        },
        { status: 500 },
      );
    }

    if (!existing) {
      return NextResponse.json(
        {
          error:
            "Attendance record not found.",
        },
        { status: 404 },
      );
    }

    const { error } = await supabaseAdmin
      .from("Attendance")
      .delete()
      .eq("id", attendanceId)
      .eq("studentId", studentId)
      .eq("tenantId", tenantId);

    if (error) {
      console.error(
        "Student attendance DELETE error:",
        error,
      );

      return NextResponse.json(
        {
          error:
            "Unable to delete student attendance.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      deleted: true,
      attendanceId,
      date: existing.date,
    });
  } catch (error) {
    console.error(
      "DELETE /api/students/[id]/attendance error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to delete student attendance.",
      },
      { status: 500 },
    );
  }
}
