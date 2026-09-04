import { NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { logTeacherActivity } from "@/lib/teacherActivity";

/* ============================================================
 * TYPES
 * ============================================================ */

type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LATE"
  | "HALF_DAY"
  | "LEAVE";

type AttendanceRecord = {
  id: string;
  teacher_id: string;
  attendance_date: string;
  status: AttendanceStatus;
  check_in_time: string | null;
  check_out_time: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  tenantId: string;
};

type TeacherRecord = {
  id: string;
  employee_id: string | null;
  first_name: string | null;
  last_name: string | null;
  name: string;
  role: string;
  status?: string;
  tenantId?: string;
};

type AppUser = {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  role: string;
};

type AuthContext = {
  supabaseAdmin: SupabaseClient;
  tenantId: string;
  appUser: AppUser;
};

/* ============================================================
 * CONSTANTS
 * ============================================================ */

const VALID_STATUSES: readonly AttendanceStatus[] = [
  "PRESENT",
  "ABSENT",
  "LATE",
  "HALF_DAY",
  "LEAVE",
];

/* ============================================================
 * SUPABASE ADMIN CLIENT
 * ============================================================ */

function getSupabaseAdmin(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase server configuration is missing.",
    );
  }

  return createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

/* ============================================================
 * VALIDATION
 * ============================================================ */

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

function optionalString(
  value: unknown,
): string | null {
  const result = String(value ?? "").trim();
  return result || null;
}

/*
 * PostgreSQL TIME accepts HH:MM:SS.
 *
 * Browser <input type="time"> normally sends HH:MM.
 */
function normalizeTime(
  value: unknown,
): string | null {
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

/* ============================================================
 * AUTH CONTEXT
 * ============================================================ */

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

  const supabaseAuth =
    createServerClient(
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
  } =
    await supabaseAuth.auth.getUser();

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

  const supabaseAdmin =
    createClient(
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
    data: appUserData,
    error: userError,
  } =
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
      "Teacher attendance User lookup error:",
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

  if (!appUserData) {
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

  const appUser =
    appUserData as AppUser;

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
    appUser,
  };
}

/* ============================================================
 * LOAD TEACHER
 * ============================================================ */

async function getTeacher(
  supabaseAdmin: SupabaseClient,
  teacherId: string,
  tenantId: string,
): Promise<
  { teacher: TeacherRecord } |
  { error: NextResponse }
> {
  const {
    data,
    error,
  } =
    await supabaseAdmin
      .from("Staff")
      .select(
        `
          id,
          employee_id,
          first_name,
          last_name,
          name,
          role,
          status,
          tenantId
        `,
      )
      .eq("id", teacherId)
      .eq("tenantId", tenantId)
      .eq("role", "Teacher")
      .maybeSingle();

  if (error) {
    console.error(
      "Teacher lookup error:",
      error,
    );

    return {
      error: NextResponse.json(
        { error: error.message },
        { status: 500 },
      ),
    };
  }

  if (!data) {
    return {
      error: NextResponse.json(
        {
          error: "Teacher not found.",
        },
        { status: 404 },
      ),
    };
  }

  return {
    teacher: data as TeacherRecord,
  };
}

/* ============================================================
 * GET ATTENDANCE
 * ============================================================ */

export async function GET(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const authContext =
      await getAuthContext();

    if ("error" in authContext) {
      return authContext.error;
    }

    const {
      supabaseAdmin,
      tenantId,
    } = authContext;

    const { id } =
      await context.params;

    const teacherId =
      decodeURIComponent(id).trim();

    if (!teacherId) {
      return NextResponse.json(
        {
          error:
            "Teacher ID is required.",
        },
        { status: 400 },
      );
    }

    const teacherResult =
      await getTeacher(
        supabaseAdmin,
        teacherId,
        tenantId,
      );

    if ("error" in teacherResult) {
      return teacherResult.error;
    }

    const {
      searchParams,
    } = new URL(request.url);

    const date =
      String(
        searchParams.get("date") ?? "",
      ).trim();

    const from =
      String(
        searchParams.get("from") ?? "",
      ).trim();

    const to =
      String(
        searchParams.get("to") ?? "",
      ).trim();

    const status =
      String(
        searchParams.get("status") ?? "",
      )
        .trim()
        .toUpperCase();

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

    if (
      status &&
      !validStatus(status)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid attendance status.",
        },
        { status: 400 },
      );
    }

    let query =
      supabaseAdmin
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
            tenantId
          `,
        )
        .eq("teacher_id", teacherId)
        .eq("tenantId", tenantId)
        .order(
          "attendance_date",
          { ascending: false },
        )
        .order(
          "created_at",
          { ascending: false },
        );

    if (date) {
      query =
        query.eq(
          "attendance_date",
          date,
        );
    }

    if (from) {
      query =
        query.gte(
          "attendance_date",
          from,
        );
    }

    if (to) {
      query =
        query.lte(
          "attendance_date",
          to,
        );
    }

    if (status) {
      query =
        query.eq(
          "status",
          status,
        );
    }

    const {
      data,
      error,
    } = await query;

    if (error) {
      console.error(
        "Teacher attendance GET error:",
        error,
      );

      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      );
    }

    const attendance =
      (data ?? []) as AttendanceRecord[];

    return NextResponse.json({
      teacher:
        teacherResult.teacher,
      attendance,
      total: attendance.length,
    });
  } catch (error) {
    console.error(
      "Unable to load teacher attendance:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load teacher attendance.",
      },
      { status: 500 },
    );
  }
}

/* ============================================================
 * POST ATTENDANCE
 * ============================================================ */

export async function POST(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const authContext =
      await getAuthContext();

    if ("error" in authContext) {
      return authContext.error;
    }

    const {
      supabaseAdmin,
      tenantId,
    } = authContext;

    const { id } =
      await context.params;

    const teacherId =
      decodeURIComponent(id).trim();

    const body =
      await request.json();

    const attendanceDate =
      String(
        body.attendance_date ?? "",
      ).trim();

    const status =
      String(
        body.status ?? "PRESENT",
      )
        .trim()
        .toUpperCase();

    const checkInTime =
      normalizeTime(
        body.check_in_time,
      );

    const checkOutTime =
      normalizeTime(
        body.check_out_time,
      );

    const notes =
      optionalString(
        body.notes,
      );

    if (!teacherId) {
      return NextResponse.json(
        {
          error:
            "Teacher ID is required.",
        },
        { status: 400 },
      );
    }

    if (
      !attendanceDate ||
      !validDate(attendanceDate)
    ) {
      return NextResponse.json(
        {
          error:
            "Attendance date is required and must use YYYY-MM-DD.",
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

    if (
      body.check_in_time &&
      !checkInTime
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid check-in time. Use HH:MM.",
        },
        { status: 400 },
      );
    }

    if (
      body.check_out_time &&
      !checkOutTime
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid check-out time. Use HH:MM.",
        },
        { status: 400 },
      );
    }

    const teacherResult =
      await getTeacher(
        supabaseAdmin,
        teacherId,
        tenantId,
      );

    if ("error" in teacherResult) {
      return teacherResult.error;
    }

    const {
      data: existingData,
      error: existingError,
    } =
      await supabaseAdmin
        .from("teacher_attendance")
        .select(
          "id, status, attendance_date, tenantId",
        )
        .eq("teacher_id", teacherId)
        .eq("tenantId", tenantId)
        .eq(
          "attendance_date",
          attendanceDate,
        )
        .maybeSingle();

    if (existingError) {
      return NextResponse.json(
        {
          error:
            existingError.message,
        },
        { status: 500 },
      );
    }

    if (existingData) {
      return NextResponse.json(
        {
          error:
            "Attendance already exists for this teacher on this date.",
          attendance:
            existingData,
        },
        { status: 409 },
      );
    }

    const insertPayload = {
      teacher_id: teacherId,
      attendance_date:
        attendanceDate,
      status,
      check_in_time:
        checkInTime,
      check_out_time:
        checkOutTime,
      notes,
      tenantId,
    };

    const {
      data: insertedData,
      error: insertError,
    } =
      await supabaseAdmin
        .from("teacher_attendance")
        .insert(insertPayload)
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
            tenantId
          `,
        )
        .single();

    if (insertError) {
      console.error(
        "Teacher attendance POST error:",
        insertError,
      );

      return NextResponse.json(
        {
          error:
            insertError.message,
        },
        { status: 500 },
      );
    }

    const attendance =
      insertedData as AttendanceRecord;

    await logTeacherActivity({
      teacherId,
      action:
        "TEACHER_ATTENDANCE_CREATED",
      description:
        `Teacher attendance marked ${status} for ${attendanceDate}.`,
      metadata: {
        attendance_id:
          attendance.id,
        attendance_date:
          attendanceDate,
        status,
        tenantId,
      },
    });

    return NextResponse.json(
      {
        attendance,
        message:
          "Teacher attendance marked successfully.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "Unable to create teacher attendance:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create teacher attendance.",
      },
      { status: 500 },
    );
  }
}

/* ============================================================
 * PATCH ATTENDANCE
 * ============================================================ */

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const authContext =
      await getAuthContext();

    if ("error" in authContext) {
      return authContext.error;
    }

    const {
      supabaseAdmin,
      tenantId,
    } = authContext;

    const { id } =
      await context.params;

    const teacherId =
      decodeURIComponent(id).trim();

    const {
      searchParams,
    } = new URL(request.url);

    const attendanceId =
      String(
        searchParams.get("id") ?? "",
      ).trim();

    if (!teacherId || !attendanceId) {
      return NextResponse.json(
        {
          error:
            "Teacher ID and attendance ID are required.",
        },
        { status: 400 },
      );
    }

    const body =
      await request.json();

    const updates: {
      attendance_date?: string;
      status?: AttendanceStatus;
      check_in_time?: string | null;
      check_out_time?: string | null;
      notes?: string | null;
    } = {};

    if (
      body.attendance_date !==
      undefined
    ) {
      const date =
        String(
          body.attendance_date,
        ).trim();

      if (!validDate(date)) {
        return NextResponse.json(
          {
            error:
              "Invalid attendance date. Use YYYY-MM-DD.",
          },
          { status: 400 },
        );
      }

      updates.attendance_date =
        date;
    }

    if (
      body.status !== undefined
    ) {
      const nextStatus =
        String(body.status)
          .trim()
          .toUpperCase();

      if (
        !validStatus(nextStatus)
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid attendance status.",
          },
          { status: 400 },
        );
      }

      updates.status =
        nextStatus;
    }

    if (
      body.check_in_time !==
      undefined
    ) {
      const time =
        normalizeTime(
          body.check_in_time,
        );

      if (
        body.check_in_time &&
        !time
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid check-in time. Use HH:MM.",
          },
          { status: 400 },
        );
      }

      updates.check_in_time =
        time;
    }

    if (
      body.check_out_time !==
      undefined
    ) {
      const time =
        normalizeTime(
          body.check_out_time,
        );

      if (
        body.check_out_time &&
        !time
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid check-out time. Use HH:MM.",
          },
          { status: 400 },
        );
      }

      updates.check_out_time =
        time;
    }

    if (
      body.notes !== undefined
    ) {
      updates.notes =
        optionalString(
          body.notes,
        );
    }

    if (
      Object.keys(updates).length ===
      0
    ) {
      return NextResponse.json(
        {
          error:
            "No attendance changes supplied.",
        },
        { status: 400 },
      );
    }

    const {
      data: existingData,
      error: lookupError,
    } =
      await supabaseAdmin
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
            tenantId
          `,
        )
        .eq("id", attendanceId)
        .eq("teacher_id", teacherId)
        .eq("tenantId", tenantId)
        .maybeSingle();

    if (lookupError) {
      return NextResponse.json(
        {
          error:
            lookupError.message,
        },
        { status: 500 },
      );
    }

    if (!existingData) {
      return NextResponse.json(
        {
          error:
            "Attendance record not found.",
        },
        { status: 404 },
      );
    }

    const existing =
      existingData as AttendanceRecord;

    const nextDate =
      updates.attendance_date ??
      existing.attendance_date;

    const {
      data: duplicateData,
      error: duplicateError,
    } =
      await supabaseAdmin
        .from("teacher_attendance")
        .select("id")
        .eq("teacher_id", teacherId)
        .eq("tenantId", tenantId)
        .eq(
          "attendance_date",
          nextDate,
        )
        .neq("id", attendanceId)
        .maybeSingle();

    if (duplicateError) {
      return NextResponse.json(
        {
          error:
            duplicateError.message,
        },
        { status: 500 },
      );
    }

    if (duplicateData) {
      return NextResponse.json(
        {
          error:
            "Another attendance record already exists for this teacher on this date.",
        },
        { status: 409 },
      );
    }

    const {
      data: updatedData,
      error: updateError,
    } =
      await supabaseAdmin
        .from("teacher_attendance")
        .update(updates)
        .eq("id", attendanceId)
        .eq("teacher_id", teacherId)
        .eq("tenantId", tenantId)
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
            tenantId
          `,
        )
        .single();

    if (updateError) {
      console.error(
        "Teacher attendance PATCH error:",
        updateError,
      );

      return NextResponse.json(
        {
          error:
            updateError.message,
        },
        { status: 500 },
      );
    }

    const attendance =
      updatedData as AttendanceRecord;

    await logTeacherActivity({
      teacherId,
      action:
        "TEACHER_ATTENDANCE_UPDATED",
      description:
        `Teacher attendance updated for ${attendance.attendance_date}.`,
      metadata: {
        attendance_id:
          attendance.id,
        previous_status:
          existing.status,
        status:
          attendance.status,
        previous_date:
          existing.attendance_date,
        attendance_date:
          attendance.attendance_date,
        fields:
          Object.keys(updates),
        tenantId,
      },
    });

    return NextResponse.json({
      attendance,
      message:
        "Teacher attendance updated successfully.",
    });
  } catch (error) {
    console.error(
      "Unable to update teacher attendance:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to update teacher attendance.",
      },
      { status: 500 },
    );
  }
}

/* ============================================================
 * DELETE ATTENDANCE
 * ============================================================ */

export async function DELETE(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const authContext =
      await getAuthContext();

    if ("error" in authContext) {
      return authContext.error;
    }

    const {
      supabaseAdmin,
      tenantId,
    } = authContext;

    const { id } =
      await context.params;

    const teacherId =
      decodeURIComponent(id).trim();

    const {
      searchParams,
    } = new URL(request.url);

    const attendanceId =
      String(
        searchParams.get("id") ?? "",
      ).trim();

    if (!teacherId || !attendanceId) {
      return NextResponse.json(
        {
          error:
            "Teacher ID and attendance ID are required.",
        },
        { status: 400 },
      );
    }

    const {
      data: existingData,
      error: lookupError,
    } =
      await supabaseAdmin
        .from("teacher_attendance")
        .select(
          `
            id,
            teacher_id,
            attendance_date,
            status,
            tenantId
          `,
        )
        .eq("id", attendanceId)
        .eq("teacher_id", teacherId)
        .eq("tenantId", tenantId)
        .maybeSingle();

    if (lookupError) {
      return NextResponse.json(
        {
          error:
            lookupError.message,
        },
        { status: 500 },
      );
    }

    if (!existingData) {
      return NextResponse.json(
        {
          error:
            "Attendance record not found.",
        },
        { status: 404 },
      );
    }

    const existing =
      existingData as AttendanceRecord;

    const {
      error: deleteError,
    } =
      await supabaseAdmin
        .from("teacher_attendance")
        .delete()
        .eq("id", attendanceId)
        .eq("teacher_id", teacherId)
        .eq("tenantId", tenantId);

    if (deleteError) {
      console.error(
        "Teacher attendance DELETE error:",
        deleteError,
      );

      return NextResponse.json(
        {
          error:
            deleteError.message,
        },
        { status: 500 },
      );
    }

    await logTeacherActivity({
      teacherId,
      action:
        "TEACHER_ATTENDANCE_DELETED",
      description:
        `Teacher attendance deleted for ${existing.attendance_date}.`,
      metadata: {
        attendance_id:
          existing.id,
        attendance_date:
          existing.attendance_date,
        status:
          existing.status,
        tenantId,
      },
    });

    return NextResponse.json({
      message:
        "Teacher attendance deleted successfully.",
      id: attendanceId,
    });
  } catch (error) {
    console.error(
      "Unable to delete teacher attendance:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to delete teacher attendance.",
      },
      { status: 500 },
    );
  }
}
