import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

type AttendanceStatus = "PRESENT" | "ABSENT";

type AttendanceRecord = {
  student_id: string;
  status: AttendanceStatus;
  notes?: string | null;
};

function validDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/*
 * Timetable convention:
 * Monday = 1
 * Tuesday = 2
 * Wednesday = 3
 * Thursday = 4
 * Friday = 5
 * Saturday = 6
 *
 * JavaScript Date.getDay():
 * Sunday = 0 ... Saturday = 6
 */
function getAcademicWeekday(dateValue: string): number {
  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return 0;
  }

  const jsDay = date.getDay();

  // Sunday is not an academic timetable day.
  if (jsDay === 0) {
    return 0;
  }

  return jsDay;
}

function validStatus(value: unknown): value is AttendanceStatus {
  return value === "PRESENT" || value === "ABSENT";
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

  if (!supabaseUrl || !publishableKey || !serviceRoleKey) {
    return {
      error: NextResponse.json(
        {
          success: false,
          error: "Supabase environment is not fully configured.",
        },
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
            cookiesToSet.forEach(
              ({ name, value, options }) => {
                cookieStore.set(name, value, options);
              }
            );
          } catch {
            // Ignore read-only cookie environments.
          }
        },
      },
    }
  );

  const {
    data: { user },
    error: authError,
  } = await supabaseAuth.auth.getUser();

  if (authError || !user?.email) {
    return {
      error: NextResponse.json(
        {
          success: false,
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
      .select('id, "tenantId", email, name, role')
      .eq("email", user.email)
      .maybeSingle();

  if (userError) {
    return {
      error: NextResponse.json(
        {
          success: false,
          error: "Unable to load application user.",
        },
        { status: 500 }
      ),
    };
  }

  if (!appUser?.tenantId) {
    return {
      error: NextResponse.json(
        {
          success: false,
          error: "Authenticated user has no tenant.",
        },
        { status: 403 }
      ),
    };
  }

  return {
    supabaseAdmin,
    tenantId: appUser.tenantId as string,
  };
}

async function validateContext(
  supabaseAdmin: SupabaseClient,
  tenantId: string,
  academicYearId: string,
  classId: string,
  sectionId: string,
  subjectId: string
) {
  const { data: academicYear, error: academicYearError } =
    await supabaseAdmin
      .from("academic_years")
      .select("id, name, status")
      .eq("id", academicYearId)
      .eq("tenantId", tenantId)
      .maybeSingle();

  if (academicYearError) throw academicYearError;

  if (!academicYear) {
    return { error: "Academic year not found." };
  }

  const { data: classRecord, error: classError } =
    await supabaseAdmin
      .from("classes")
      .select("id, name, status")
      .eq("id", classId)
      .eq("tenantId", tenantId)
      .maybeSingle();

  if (classError) throw classError;

  if (!classRecord) {
    return { error: "Class not found." };
  }

  const { data: section, error: sectionError } =
    await supabaseAdmin
      .from("sections")
      .select("id, name, class_id, status")
      .eq("id", sectionId)
      .eq("tenantId", tenantId)
      .maybeSingle();

  if (sectionError) throw sectionError;

  if (!section) {
    return { error: "Section not found." };
  }

  if (section.class_id !== classId) {
    return {
      error: "Section does not belong to the selected class.",
    };
  }

  const { data: subject, error: subjectError } =
    await supabaseAdmin
      .from("subjects")
      .select("id, name, code, status")
      .eq("id", subjectId)
      .eq("tenantId", tenantId)
      .maybeSingle();

  if (subjectError) throw subjectError;

  if (!subject) {
    return { error: "Subject not found." };
  }

  return {
    academicYear,
    classRecord,
    section,
    subject,
  };
}

export async function GET(request: Request) {
  try {
    const context = await getAuthContext();

    if ("error" in context) {
      return context.error;
    }

    const { supabaseAdmin, tenantId } = context;

    const url = new URL(request.url);

    const academicYearId =
      url.searchParams.get("academic_year_id")?.trim() || "";
    const classId =
      url.searchParams.get("class_id")?.trim() || "";
    const sectionId =
      url.searchParams.get("section_id")?.trim() || "";
    const subjectId =
      url.searchParams.get("subject_id")?.trim() || "";
    const periodNumber = Number(
      url.searchParams.get("period_number")
    );
    const date =
      url.searchParams.get("date")?.trim() || "";

    if (
      !academicYearId ||
      !classId ||
      !sectionId ||
      !subjectId ||
      !Number.isInteger(periodNumber) ||
      periodNumber < 1 ||
      periodNumber > 20 ||
      !validDate(date)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "academic_year_id, class_id, section_id, subject_id, period_number and date are required.",
        },
        { status: 400 }
      );
    }

    const validation = await validateContext(
      supabaseAdmin,
      tenantId,
      academicYearId,
      classId,
      sectionId,
      subjectId
    );

    if ("error" in validation) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error,
        },
        { status: 400 }
      );
    }

    const { data: attendance, error } =
      await supabaseAdmin
        .from("class_period_attendance")
        .select(`
          id,
          attendance_date,
          academic_year_id,
          class_id,
          section_id,
          subject_id,
          period_number,
          teacher_id,
          created_at,
          updated_at,
          class_period_attendance_students (
            id,
            student_id,
            status,
            notes
          )
        `)
        .eq("tenantId", tenantId)
        .eq("academic_year_id", academicYearId)
        .eq("class_id", classId)
        .eq("section_id", sectionId)
        .eq("subject_id", subjectId)
        .eq("period_number", periodNumber)
        .eq("attendance_date", date)
        .maybeSingle();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: "Unable to load class attendance.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      attendance: attendance ?? null,
    });
  } catch (error) {
    console.error(
      "GET /api/class-period-attendance error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load class attendance.",
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

    let body: Record<string, unknown>;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON request body.",
        },
        { status: 400 }
      );
    }

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

    const subjectId =
      typeof body.subject_id === "string"
        ? body.subject_id.trim()
        : "";

    const teacherId =
      typeof body.teacher_id === "string" &&
      body.teacher_id.trim()
        ? body.teacher_id.trim()
        : null;

    const attendanceDate =
      typeof body.date === "string"
        ? body.date.trim()
        : "";

    const periodNumber = Number(body.period_number);

    const timetableDayOfWeek =
      getAcademicWeekday(attendanceDate);

    const records = Array.isArray(body.records)
      ? body.records
      : [];

    if (
      !academicYearId ||
      !classId ||
      !sectionId ||
      !subjectId ||
      !validDate(attendanceDate) ||
      !Number.isInteger(periodNumber) ||
      periodNumber < 1 ||
      periodNumber > 20 ||
      records.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "academic_year_id, class_id, section_id, subject_id, date, period_number and records are required.",
        },
        { status: 400 }
      );
    }

    if (
      timetableDayOfWeek < 1 ||
      timetableDayOfWeek > 6
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Class-period attendance can only be recorded Monday through Saturday.",
        },
        { status: 400 }
      );
    }

    const validation = await validateContext(
      supabaseAdmin,
      tenantId,
      academicYearId,
      classId,
      sectionId,
      subjectId
    );

    if ("error" in validation) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error,
        },
        { status: 400 }
      );
    }

    const normalizedRecords: AttendanceRecord[] = records.map(
      (record: AttendanceRecord) => ({
        student_id:
          typeof record.student_id === "string"
            ? record.student_id.trim()
            : "",
        status: record.status,
        notes:
          typeof record.notes === "string"
            ? record.notes.trim() || null
            : null,
      })
    );

    if (
      normalizedRecords.some(
        (record) =>
          !record.student_id ||
          !validStatus(record.status)
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Each record must contain a valid student_id and PRESENT or ABSENT status.",
        },
        { status: 400 }
      );
    }

    const studentIds = normalizedRecords.map(
      (record) => record.student_id
    );

    if (new Set(studentIds).size !== studentIds.length) {
      return NextResponse.json(
        {
          success: false,
          error: "Duplicate student records are not allowed.",
        },
        { status: 400 }
      );
    }

    const { data: enrollments, error: enrollmentError } =
      await supabaseAdmin
        .from("student_enrollments")
        .select(
          "student_id, class_id, section_id, academic_year_id, status"
        )
        .eq("tenantId", tenantId)
        .eq("academic_year_id", academicYearId)
        .eq("class_id", classId)
        .eq("section_id", sectionId)
        .in("student_id", studentIds)
        .eq("status", "ACTIVE");

    if (enrollmentError) {
      throw enrollmentError;
    }

    const enrolledIds = new Set(
      (enrollments ?? []).map(
        (item: { student_id: string }) => item.student_id
      )
    );

    const invalidStudent = studentIds.find(
      (studentId) => !enrolledIds.has(studentId)
    );

    if (invalidStudent) {
      return NextResponse.json(
        {
          success: false,
          error:
            "One or more selected students are not actively enrolled in the selected class, section and academic year.",
          student_id: invalidStudent,
        },
        { status: 400 }
      );
    }

    const { data: timetable, error: timetableError } =
      await supabaseAdmin
        .from("timetables")
        .select(`
          id,
          teacher_id,
          subject_id,
          class_id,
          section_id,
          academic_year_id,
          period_number,
          day_of_week,
          status
        `)
        .eq("tenantId", tenantId)
        .eq("academic_year_id", academicYearId)
        .eq("class_id", classId)
        .eq("section_id", sectionId)
        .eq("subject_id", subjectId)
        .eq("period_number", periodNumber)
        .eq("day_of_week", timetableDayOfWeek)
        .eq("status", "ACTIVE")
        .limit(1)
        .maybeSingle();

    if (timetableError) {
      throw timetableError;
    }

    if (!timetable) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No active timetable entry exists for the selected class, section, subject, period and attendance date.",
        },
        { status: 400 }
      );
    }

    if (
      teacherId &&
      timetable.teacher_id &&
      timetable.teacher_id !== teacherId
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Selected teacher does not match the timetable assignment.",
        },
        { status: 400 }
      );
    }

    const effectiveTeacherId =
      teacherId || timetable.teacher_id || null;

    const { data: existing, error: existingError } =
      await supabaseAdmin
        .from("class_period_attendance")
        .select("id")
        .eq("tenantId", tenantId)
        .eq("academic_year_id", academicYearId)
        .eq("class_id", classId)
        .eq("section_id", sectionId)
        .eq("subject_id", subjectId)
        .eq("period_number", periodNumber)
        .eq("attendance_date", attendanceDate)
        .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    let attendanceId = existing?.id ?? null;

    if (!attendanceId) {
      attendanceId = `class_period_attendance_${crypto.randomUUID()}`;

      const { error: insertAttendanceError } =
        await supabaseAdmin
          .from("class_period_attendance")
          .insert({
            id: attendanceId,
            tenantId,
            attendance_date: attendanceDate,
            academic_year_id: academicYearId,
            class_id: classId,
            section_id: sectionId,
            subject_id: subjectId,
            period_number: periodNumber,
            teacher_id: effectiveTeacherId,
          });

      if (insertAttendanceError) {
        if (insertAttendanceError.code === "23505") {
          return NextResponse.json(
            {
              success: false,
              error:
                "Attendance for this class, date, subject and period already exists. Reload and update the existing record.",
            },
            { status: 409 }
          );
        }

        throw insertAttendanceError;
      }
    } else {
      const { error: updateAttendanceError } =
        await supabaseAdmin
          .from("class_period_attendance")
          .update({
            teacher_id: effectiveTeacherId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", attendanceId)
          .eq("tenantId", tenantId);

      if (updateAttendanceError) {
        throw updateAttendanceError;
      }
    }

    const rows = normalizedRecords.map((record) => ({
      id: `class_period_student_attendance_${crypto.randomUUID()}`,
      tenantId,
      class_period_attendance_id: attendanceId,
      student_id: record.student_id,
      status: record.status,
      notes: record.notes ?? null,
    }));

    const { error: deleteExistingError } =
      await supabaseAdmin
        .from("class_period_attendance_students")
        .delete()
        .eq("tenantId", tenantId)
        .eq(
          "class_period_attendance_id",
          attendanceId
        );

    if (deleteExistingError) {
      throw deleteExistingError;
    }

    const { error: insertStudentsError } =
      await supabaseAdmin
        .from("class_period_attendance_students")
        .insert(rows);

    if (insertStudentsError) {
      throw insertStudentsError;
    }

    const { data: saved, error: savedError } =
      await supabaseAdmin
        .from("class_period_attendance")
        .select(`
          id,
          attendance_date,
          academic_year_id,
          class_id,
          section_id,
          subject_id,
          period_number,
          teacher_id,
          created_at,
          updated_at,
          class_period_attendance_students (
            id,
            student_id,
            status,
            notes
          )
        `)
        .eq("id", attendanceId)
        .eq("tenantId", tenantId)
        .single();

    if (savedError) {
      throw savedError;
    }

    return NextResponse.json(
      {
        success: true,
        attendance: saved,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(
      "POST /api/class-period-attendance error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to save class attendance.",
        details:
          process.env.NODE_ENV === "development"
            ? errorMessage(error)
            : undefined,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
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
          success: false,
          error: "Invalid JSON request body.",
        },
        { status: 400 },
      );
    }

    const attendanceStudentId =
      typeof body.attendance_student_id === "string"
        ? body.attendance_student_id.trim()
        : "";

    const status =
      typeof body.status === "string"
        ? body.status.trim()
        : "";

    const notes =
      typeof body.notes === "string"
        ? body.notes.trim() || null
        : body.notes === null
          ? null
          : undefined;

    if (!attendanceStudentId) {
      return NextResponse.json(
        {
          success: false,
          error: "Class-period attendance student ID is required.",
        },
        { status: 400 },
      );
    }

    if (status !== "PRESENT" && status !== "ABSENT") {
      return NextResponse.json(
        {
          success: false,
          error: "Status must be PRESENT or ABSENT.",
        },
        { status: 400 },
      );
    }

    const {
      data: existingStudent,
      error: existingError,
    } = await supabaseAdmin
      .from("class_period_attendance_students")
      .select(`
        id,
        class_period_attendance_id,
        student_id,
        status,
        notes
      `)
      .eq("id", attendanceStudentId)
      .eq("tenantId", tenantId)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    if (!existingStudent) {
      return NextResponse.json(
        {
          success: false,
          error: "Class-period attendance record not found.",
        },
        { status: 404 },
      );
    }

    const {
      data: approval,
      error: approvalError,
    } = await supabaseAdmin
      .from("attendance_approvals")
      .select("status")
      .eq("tenantId", tenantId)
      .eq(
        "attendance_student_id",
        attendanceStudentId,
      )
      .maybeSingle();

    if (approvalError) {
      throw approvalError;
    }

    if (
      approval?.status === "PENDING" ||
      approval?.status === "APPROVED"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            approval.status === "APPROVED"
              ? "Approved attendance cannot be edited."
              : "Pending attendance cannot be edited until it is rejected.",
          approvalStatus: approval.status,
        },
        { status: 409 },
      );
    }

    const updateData: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const {
      data: updated,
      error: updateError,
    } = await supabaseAdmin
      .from("class_period_attendance_students")
      .update(updateData)
      .eq("id", attendanceStudentId)
      .eq("tenantId", tenantId)
      .select(`
        id,
        class_period_attendance_id,
        student_id,
        status,
        notes
      `)
      .single();

    if (updateError) {
      throw updateError;
    }

    const {
      error: parentUpdateError,
    } = await supabaseAdmin
      .from("class_period_attendance")
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingStudent.class_period_attendance_id)
      .eq("tenantId", tenantId);

    if (parentUpdateError) {
      throw parentUpdateError;
    }

    return NextResponse.json({
      success: true,
      attendance: updated,
    });
  } catch (error: unknown) {
    console.error(
      "PATCH /api/class-period-attendance error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to update class attendance.",
        details:
          process.env.NODE_ENV === "development"
            ? errorMessage(error)
            : undefined,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const context = await getAuthContext();

    if ("error" in context) {
      return context.error;
    }

    const { supabaseAdmin, tenantId } = context;

    const url = new URL(request.url);

    const attendanceStudentId =
      url.searchParams.get(
        "attendance_student_id",
      )?.trim() ?? "";

    if (!attendanceStudentId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Class-period attendance student ID is required.",
        },
        { status: 400 },
      );
    }

    const {
      data: existingStudent,
      error: existingError,
    } = await supabaseAdmin
      .from("class_period_attendance_students")
      .select(`
        id,
        class_period_attendance_id,
        student_id
      `)
      .eq("id", attendanceStudentId)
      .eq("tenantId", tenantId)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    if (!existingStudent) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Class-period attendance record not found.",
        },
        { status: 404 },
      );
    }

    const {
      data: approval,
      error: approvalError,
    } = await supabaseAdmin
      .from("attendance_approvals")
      .select("status")
      .eq("tenantId", tenantId)
      .eq(
        "attendance_student_id",
        attendanceStudentId,
      )
      .maybeSingle();

    if (approvalError) {
      throw approvalError;
    }

    if (
      approval?.status === "PENDING" ||
      approval?.status === "APPROVED"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            approval.status === "APPROVED"
              ? "Approved attendance cannot be deleted."
              : "Pending attendance cannot be deleted until it is rejected.",
          approvalStatus: approval.status,
        },
        { status: 409 },
      );
    }

    const {
      error: deleteError,
    } = await supabaseAdmin
      .from("class_period_attendance_students")
      .delete()
      .eq("id", attendanceStudentId)
      .eq("tenantId", tenantId);

    if (deleteError) {
      throw deleteError;
    }

    const {
      data: remainingStudents,
      error: remainingError,
    } = await supabaseAdmin
      .from("class_period_attendance_students")
      .select("id")
      .eq(
        "class_period_attendance_id",
        existingStudent.class_period_attendance_id,
      )
      .eq("tenantId", tenantId)
      .limit(1);

    if (remainingError) {
      throw remainingError;
    }

    if (!remainingStudents || remainingStudents.length === 0) {
      const {
        error: deleteParentError,
      } = await supabaseAdmin
        .from("class_period_attendance")
        .delete()
        .eq(
          "id",
          existingStudent.class_period_attendance_id,
        )
        .eq("tenantId", tenantId);

      if (deleteParentError) {
        throw deleteParentError;
      }
    } else {
      const {
        error: updateParentError,
      } = await supabaseAdmin
        .from("class_period_attendance")
        .update({
          updated_at: new Date().toISOString(),
        })
        .eq(
          "id",
          existingStudent.class_period_attendance_id,
        )
        .eq("tenantId", tenantId);

      if (updateParentError) {
        throw updateParentError;
      }
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error: unknown) {
    console.error(
      "DELETE /api/class-period-attendance error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to delete class-period attendance.",
        details:
          process.env.NODE_ENV === "development"
            ? errorMessage(error)
            : undefined,
      },
      { status: 500 },
    );
  }
}

