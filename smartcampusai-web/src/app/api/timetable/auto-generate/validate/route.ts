import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

async function getAuthContext() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !publishableKey || !serviceRoleKey) {
    return {
      error: "Supabase environment is not configured.",
      status: 500,
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
          } catch {}
        },
      },
    },
  );

  const {
    data: { user },
    error: authError,
  } = await supabaseAuth.auth.getUser();

  if (authError || !user?.email) {
    return {
      error: "Authentication required.",
      status: 401,
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

  const { data: appUser, error: userError } = await supabaseAdmin
    .from("User")
    .select('id, "tenantId", email, name, role')
    .eq("email", user.email)
    .maybeSingle();

  if (userError) {
    throw userError;
  }

  if (!appUser?.tenantId) {
    return {
      error: "Application user has no tenant.",
      status: 403,
    };
  }

  return {
    supabaseAdmin,
    tenantId: appUser.tenantId as string,
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
      return NextResponse.json({
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
      });
    }

    const [
      academicYearResult,
      classResult,
      sectionResult,
      periodTimingsResult,
      sectionSubjectsResult,
      assignmentsResult,
      timetableResult,
    ] = await Promise.all([
      supabaseAdmin
        .from("academic_years")
        .select("id,name")
        .eq("id", academicYearId)
        .eq("tenantId", tenantId)
        .maybeSingle(),

      supabaseAdmin
        .from("classes")
        .select("id,name")
        .eq("id", classId)
        .eq("tenantId", tenantId)
        .maybeSingle(),

      supabaseAdmin
        .from("sections")
        .select("id,name,class_id")
        .eq("id", sectionId)
        .eq("tenantId", tenantId)
        .maybeSingle(),

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
        .eq("status", "ACTIVE"),

      supabaseAdmin
        .from("timetables")
        .select(
          "id,section_id,subject_id,teacher_id,day_of_week,period_number",
        )
        .eq("tenantId", tenantId)
        .eq("academic_year_id", academicYearId)
        .eq("status", "ACTIVE"),
    ]);

    if (academicYearResult.error) throw academicYearResult.error;
    if (classResult.error) throw classResult.error;
    if (sectionResult.error) throw sectionResult.error;
    if (periodTimingsResult.error) throw periodTimingsResult.error;
    if (sectionSubjectsResult.error) throw sectionSubjectsResult.error;
    if (assignmentsResult.error) throw assignmentsResult.error;
    if (timetableResult.error) throw timetableResult.error;

    if (!academicYearResult.data) {
      return NextResponse.json(
        { error: "Invalid academic year." },
        { status: 400 },
      );
    }

    if (!classResult.data) {
      return NextResponse.json(
        { error: "Invalid class." },
        { status: 400 },
      );
    }

    if (!sectionResult.data) {
      return NextResponse.json(
        { error: "Invalid section." },
        { status: 400 },
      );
    }

    if (sectionResult.data.class_id !== classId) {
      return NextResponse.json(
        {
          error: "Section does not belong to the selected class.",
        },
        { status: 400 },
      );
    }

    const academicYearName = academicYearResult.data.name;
    const className = classResult.data.name;
    const sectionName = sectionResult.data.name;

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
      existingTimetable
        .filter((item) => item.section_id === sectionId)
        .map(
          (item) =>
            `${item.day_of_week}-${item.period_number}`,
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

    const selectedAssignments = assignments.filter(
      (assignment) =>
        assignment.class_name === className &&
        assignment.section_name === sectionName &&
        assignment.academic_year === academicYearName &&
        assignment.status === "ACTIVE",
    );

    const assignmentByTeacherSubject = new Map<
      string,
      any
    >();

    for (const assignment of selectedAssignments) {
      assignmentByTeacherSubject.set(
        `${assignment.teacher_id}-${assignment.subject_name}`,
        assignment,
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

    const proposedSectionSlots = new Set<string>();
    const proposedTeacherSlots = new Set<string>();
    const subjectCounts = new Map<string, number>();

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
          code: "BREAK_PERIOD",
          message: `Period ${row.period_number} is a break and cannot contain a class.`,
          row: rowNumber,
          period_number: row.period_number,
        });
      }

      const sectionSlot =
        `${row.day_of_week}-${row.period_number}`;

      if (existingSectionSlots.has(sectionSlot)) {
        errors.push({
          code: "SECTION_CONFLICT",
          message:
            `Section already has a class on day ${row.day_of_week}, period ${row.period_number}.`,
          row: rowNumber,
          day_of_week: row.day_of_week,
          period_number: row.period_number,
        });
      }

      if (proposedSectionSlots.has(sectionSlot)) {
        errors.push({
          code: "PREVIEW_SECTION_DUPLICATE",
          message:
            "Duplicate section slot in the generated preview.",
          row: rowNumber,
          day_of_week: row.day_of_week,
          period_number: row.period_number,
        });
      }

      proposedSectionSlots.add(sectionSlot);

      const teacherSlot =
        `${row.teacher_id}-${row.day_of_week}-${row.period_number}`;

      if (existingTeacherSlots.has(teacherSlot)) {
        errors.push({
          code: "TEACHER_CONFLICT",
          message:
            "Teacher already has another class during this period.",
          row: rowNumber,
          day_of_week: row.day_of_week,
          period_number: row.period_number,
        });
      }

      if (proposedTeacherSlots.has(teacherSlot)) {
        errors.push({
          code: "PREVIEW_TEACHER_DUPLICATE",
          message:
            "Teacher is assigned twice in the generated preview.",
          row: rowNumber,
          day_of_week: row.day_of_week,
          period_number: row.period_number,
        });
      }

      proposedTeacherSlots.add(teacherSlot);

      const assignment = assignmentByTeacherSubject.get(
        `${row.teacher_id}-${row.subject_name}`,
      );

      if (!assignment) {
        errors.push({
          code: "TEACHER_ASSIGNMENT_MISSING",
          message:
            `${row.subject_name} is not assigned to the selected teacher for ${className} ${sectionName} in ${academicYearName}.`,
          row: rowNumber,
          subject_name: row.subject_name,
        });
      } else {
        const currentCount =
          subjectCounts.get(row.subject_id) ?? 0;

        subjectCounts.set(
          row.subject_id,
          currentCount + 1,
        );
      }
    }

    for (const assignment of selectedAssignments) {
      const countForSubject = generated.filter(
        (row) =>
          row.subject_name === assignment.subject_name &&
          row.teacher_id === assignment.teacher_id,
      ).length;

      const subjectIds = new Set(
        generated
          .filter(
            (row) =>
              row.subject_name === assignment.subject_name &&
              row.teacher_id === assignment.teacher_id,
          )
          .map((row) => row.subject_id),
      );

      const existingCountForSubject = existingTimetable.filter(
        (row) =>
          row.section_id === sectionId &&
          row.subject_id &&
          subjectIds.has(row.subject_id),
      ).length;

      const required = Number(
        assignment.periods_per_week ?? 0,
      );

      const totalAfterPublish =
        existingCountForSubject + countForSubject;

      if (required > 0 && totalAfterPublish !== required) {
        errors.push({
          code: "PERIODS_PER_WEEK_MISMATCH",
          message:
            `${assignment.subject_name}: required ${required} periods/week, existing ${existingCountForSubject}, preview contains ${countForSubject}, total after publish ${totalAfterPublish}.`,
          subject_name: assignment.subject_name,
        });
      }
    }

    const assignedSubjectNames = new Set(
      selectedAssignments.map(
        (assignment) => assignment.subject_name,
      ),
    );

    for (const row of generated) {
      if (
        row.subject_name &&
        !assignedSubjectNames.has(row.subject_name)
      ) {
        warnings.push({
          code: "UNMATCHED_ASSIGNMENT",
          message:
            `No matching active teacher assignment was found for ${row.subject_name}.`,
          subject_name: row.subject_name,
        });
      }
    }

    const validCount = generated.length - errors.length;

    return NextResponse.json({
      valid: errors.length === 0,
      errors,
      warnings,
      summary: {
        total: generated.length,
        valid: Math.max(validCount, 0),
        errors: errors.length,
        warnings: warnings.length,
      },
    });
  } catch (error) {
    console.error(
      "Timetable preview validation error:",
      error,
    );

    return NextResponse.json(
      {
        valid: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to validate timetable preview.",
      },
      { status: 500 },
    );
  }
}
