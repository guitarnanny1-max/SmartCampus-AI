import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

async function getAuthContext() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized", status: 401 };
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("tenantId")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    throw profileError;
  }

  if (!profile?.tenantId) {
    return { error: "Tenant context not found.", status: 400 };
  }

  return {
    supabaseAdmin,
    tenantId: profile.tenantId as string,
  };
}

type PreviewRow = {
  subject_id: string;
  subject_name: string;
  teacher_id: string;
  day_of_week: number;
  day_name?: string;
  period_number: number;
  period_name?: string;
  start_time?: string;
  end_time?: string;
};

export async function POST(request: Request) {
  try {
    const context = await getAuthContext();

    if ("error" in context) {
      return NextResponse.json(
        { error: context.error },
        { status: context.status },
      );
    }

    const { supabaseAdmin, tenantId } = context;

    const body = await request.json();

    const academicYearId = String(body.academic_year_id ?? "");
    const classId = String(body.class_id ?? "");
    const sectionId = String(body.section_id ?? "");
    const generated = Array.isArray(body.generated)
      ? (body.generated as PreviewRow[])
      : [];

    if (!academicYearId || !classId || !sectionId) {
      return NextResponse.json(
        {
          error:
            "academic_year_id, class_id and section_id are required.",
        },
        { status: 400 },
      );
    }

    if (!generated.length) {
      return NextResponse.json(
        {
          valid: false,
          errors: [
            {
              code: "EMPTY_PREVIEW",
              message: "There are no generated periods to validate.",
            },
          ],
          warnings: [],
          summary: {
            total: 0,
            valid: 0,
            errors: 1,
            warnings: 0,
          },
        },
        { status: 200 },
      );
    }

    const errors: Array<{
      code: string;
      message: string;
      row?: number;
      subject_name?: string;
      day_of_week?: number;
      period_number?: number;
    }> = [];

    const warnings: Array<{
      code: string;
      message: string;
      subject_name?: string;
    }> = [];

    const [
      periodTimingsResult,
      sectionSubjectsResult,
      assignmentsResult,
      timetableResult,
    ] = await Promise.all([
      supabaseAdmin
        .from("period_timings")
        .select(
          "period_number,name,start_time,end_time,is_break,status",
        )
        .eq("tenantId", tenantId)
        .eq("academic_year_id", academicYearId)
        .eq("status", "ACTIVE"),

      supabaseAdmin
        .from("section_subjects")
        .select("subject_id,status")
        .eq("tenantId", tenantId)
        .eq("class_id", classId)
        .eq("section_id", sectionId)
        .eq("status", "ACTIVE"),

      supabaseAdmin
        .from("teacher_assignments")
        .select(
          "id,teacher_id,subject_name,class_name,section_name,academic_year,periods_per_week,assignment_type,status",
        )
        .eq("academic_year", "2026-27")
        .eq("status", "ACTIVE"),

      supabaseAdmin
        .from("timetables")
        .select(
          "id,subject_id,teacher_id,day_of_week,period_number",
        )
        .eq("tenantId", tenantId)
        .eq("academic_year_id", academicYearId)
        .eq("section_id", sectionId)
        .eq("status", "ACTIVE"),
    ]);

    if (periodTimingsResult.error) throw periodTimingsResult.error;
    if (sectionSubjectsResult.error) throw sectionSubjectsResult.error;
    if (assignmentsResult.error) throw assignmentsResult.error;
    if (timetableResult.error) throw timetableResult.error;

    const periodTimings = periodTimingsResult.data ?? [];
    const sectionSubjects = sectionSubjectsResult.data ?? [];
    const assignments = assignmentsResult.data ?? [];
    const existingTimetable = timetableResult.data ?? [];

    const timingByPeriod = new Map(
      periodTimings.map((period) => [
        period.period_number,
        period,
      ]),
    );

    const validSubjectIds = new Set(
      sectionSubjects.map((item) => item.subject_id),
    );

    const existingSectionSlots = new Set(
      existingTimetable.map(
        (item) => `${item.day_of_week}-${item.period_number}`,
      ),
    );

    const existingTeacherSlots = new Set(
      existingTimetable
        .filter((item) => item.teacher_id)
        .map(
          (item) =>
            `${item.teacher_id}-${item.day_of_week}-${item.period_number}`,
        ),
    );

    const proposedSectionSlots = new Set<string>();
    const proposedTeacherSlots = new Set<string>();

    const subjectCounts = new Map<string, number>();

    const selectedAssignments = assignments.filter(
      (assignment) =>
        assignment.section_name &&
        assignment.class_name &&
        assignment.academic_year,
    );

    for (let index = 0; index < generated.length; index += 1) {
      const row = generated[index];
      const rowNumber = index + 1;

      if (!row.subject_id || !row.teacher_id) {
        errors.push({
          code: "INVALID_ASSIGNMENT",
          message: "Subject or teacher is missing.",
          row: rowNumber,
        });
        continue;
      }

      if (!validSubjectIds.has(row.subject_id)) {
        errors.push({
          code: "SUBJECT_NOT_ASSIGNED",
          message: `${row.subject_name} is not assigned to this section.`,
          row: rowNumber,
          subject_name: row.subject_name,
        });
      }

      const timing = timingByPeriod.get(row.period_number);

      if (!timing) {
        errors.push({
          code: "INVALID_PERIOD",
          message: `Period ${row.period_number} does not exist for this academic year.`,
          row: rowNumber,
          period_number: row.period_number,
        });
      } else if (timing.is_break) {
        errors.push({
          code: "BREAK_CONFLICT",
          message: `Period ${row.period_number} is configured as a break.`,
          row: rowNumber,
          period_number: row.period_number,
        });
      }

      const sectionSlot = `${row.day_of_week}-${row.period_number}`;

      if (existingSectionSlots.has(sectionSlot)) {
        errors.push({
          code: "SECTION_CONFLICT",
          message: `The section already has a timetable entry on day ${row.day_of_week}, period ${row.period_number}.`,
          row: rowNumber,
          day_of_week: row.day_of_week,
          period_number: row.period_number,
        });
      }

      if (proposedSectionSlots.has(sectionSlot)) {
        errors.push({
          code: "PREVIEW_DUPLICATE_SECTION",
          message: `The preview contains two classes in the same section slot.`,
          row: rowNumber,
          day_of_week: row.day_of_week,
          period_number: row.period_number,
        });
      }

      proposedSectionSlots.add(sectionSlot);

      const teacherSlot = `${row.teacher_id}-${row.day_of_week}-${row.period_number}`;

      if (existingTeacherSlots.has(teacherSlot)) {
        errors.push({
          code: "TEACHER_CONFLICT",
          message: `The teacher is already teaching another section during this period.`,
          row: rowNumber,
          day_of_week: row.day_of_week,
          period_number: row.period_number,
        });
      }

      if (proposedTeacherSlots.has(teacherSlot)) {
        errors.push({
          code: "PREVIEW_DUPLICATE_TEACHER",
          message: `The preview assigns the same teacher twice in the same period.`,
          row: rowNumber,
          day_of_week: row.day_of_week,
          period_number: row.period_number,
        });
      }

      proposedTeacherSlots.add(teacherSlot);

      subjectCounts.set(
        row.subject_id,
        (subjectCounts.get(row.subject_id) ?? 0) + 1,
      );

      const matchingAssignment = selectedAssignments.find(
        (assignment) =>
          assignment.teacher_id === row.teacher_id &&
          assignment.subject_name?.trim().toLowerCase() ===
            row.subject_name?.trim().toLowerCase(),
      );

      if (!matchingAssignment) {
        errors.push({
          code: "TEACHER_ASSIGNMENT_MISSING",
          message: `${row.subject_name} does not have a matching active teacher assignment.`,
          row: rowNumber,
          subject_name: row.subject_name,
        });
      }
    }

    for (const [subjectId, count] of subjectCounts.entries()) {
      const previewSubject = generated.find(
        (row) => row.subject_id === subjectId,
      );

      const matchingAssignments = selectedAssignments.filter(
        (assignment) =>
          assignment.subject_name?.trim().toLowerCase() ===
          previewSubject?.subject_name?.trim().toLowerCase(),
      );

      const allowed = matchingAssignments.reduce(
        (sum, assignment) =>
          sum + Number(assignment.periods_per_week ?? 0),
        0,
      );

      if (allowed > 0 && count > allowed) {
        errors.push({
          code: "PERIODS_PER_WEEK_EXCEEDED",
          message: `${previewSubject?.subject_name ?? "Subject"} proposes ${count} periods, exceeding the ${allowed} periods/week assignment limit.`,
          subject_name: previewSubject?.subject_name,
        });
      }
    }

    if (errors.length === 0 && generated.length > 0) {
      warnings.push({
        code: "READY_FOR_APPROVAL",
        message:
          "The generated timetable passed validation and is ready for approval.",
      });
    }

    return NextResponse.json({
      valid: errors.length === 0,
      errors,
      warnings,
      summary: {
        total: generated.length,
        valid: generated.length - new Set(
          errors
            .filter((error) => error.row)
            .map((error) => error.row),
        ).size,
        errors: errors.length,
        warnings: warnings.length,
      },
    });
  } catch (error) {
    console.error("POST /api/timetable/auto-generate/validate", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to validate timetable preview.",
      },
      { status: 500 },
    );
  }
}
