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
  period_number: number;
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
          published: false,
          error: "There are no preview periods to publish.",
        },
        { status: 400 },
      );
    }

    const [
      academicYearResult,
      classResult,
      sectionResult,
      sectionSubjectsResult,
      periodTimingsResult,
      assignmentsResult,
      existingTimetableResult,
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
        .from("section_subjects")
        .select("subject_id,status")
        .eq("tenantId", tenantId)
        .eq("class_id", classId)
        .eq("section_id", sectionId)
        .eq("status", "ACTIVE"),

      supabaseAdmin
        .from("period_timings")
        .select(
          "period_number,name,start_time,end_time,is_break,status",
        )
        .eq("tenantId", tenantId)
        .eq("academic_year_id", academicYearId)
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
    if (sectionSubjectsResult.error) throw sectionSubjectsResult.error;
    if (periodTimingsResult.error) throw periodTimingsResult.error;
    if (assignmentsResult.error) throw assignmentsResult.error;
    if (existingTimetableResult.error)
      throw existingTimetableResult.error;

    if (!academicYearResult.data) {
      return NextResponse.json(
        { published: false, error: "Invalid academic year." },
        { status: 400 },
      );
    }

    if (!classResult.data) {
      return NextResponse.json(
        { published: false, error: "Invalid class." },
        { status: 400 },
      );
    }

    if (!sectionResult.data) {
      return NextResponse.json(
        { published: false, error: "Invalid section." },
        { status: 400 },
      );
    }

    if (sectionResult.data.class_id !== classId) {
      return NextResponse.json(
        {
          published: false,
          error: "Section does not belong to the selected class.",
        },
        { status: 400 },
      );
    }

    const academicYearName = academicYearResult.data.name;
    const className = classResult.data.name;
    const sectionName = sectionResult.data.name;

    const validSubjectIds = new Set(
      (sectionSubjectsResult.data ?? []).map(
        (item) => item.subject_id,
      ),
    );

    const timingByPeriod = new Map(
      (periodTimingsResult.data ?? []).map((item) => [
        item.period_number,
        item,
      ]),
    );

    const selectedAssignments = (
      assignmentsResult.data ?? []
    ).filter(
      (assignment) =>
        assignment.class_name === className &&
        assignment.section_name === sectionName &&
        assignment.academic_year === academicYearName &&
        assignment.status === "ACTIVE",
    );

    const assignmentKeys = new Set(
      selectedAssignments.map(
        (assignment) =>
          `${assignment.teacher_id}-${assignment.subject_name}`,
      ),
    );

    const existingTimetable =
      existingTimetableResult.data ?? [];

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

    const previewSectionSlots = new Set<string>();
    const previewTeacherSlots = new Set<string>();

    const validationErrors: string[] = [];

    for (const [index, row] of generated.entries()) {
      const rowNumber = index + 1;

      if (!row.subject_id || !row.teacher_id) {
        validationErrors.push(
          `Row ${rowNumber}: subject or teacher is missing.`,
        );
        continue;
      }

      if (!validSubjectIds.has(row.subject_id)) {
        validationErrors.push(
          `Row ${rowNumber}: ${row.subject_name} is not assigned to this section.`,
        );
      }

      const timing = timingByPeriod.get(row.period_number);

      if (!timing) {
        validationErrors.push(
          `Row ${rowNumber}: period ${row.period_number} does not exist.`,
        );
      } else if (timing.is_break) {
        validationErrors.push(
          `Row ${rowNumber}: period ${row.period_number} is a break.`,
        );
      }

      const sectionSlot =
        `${row.day_of_week}-${row.period_number}`;

      if (existingSectionSlots.has(sectionSlot)) {
        validationErrors.push(
          `Row ${rowNumber}: section already has a class on day ${row.day_of_week}, period ${row.period_number}.`,
        );
      }

      if (previewSectionSlots.has(sectionSlot)) {
        validationErrors.push(
          `Row ${rowNumber}: duplicate section slot in preview.`,
        );
      }

      previewSectionSlots.add(sectionSlot);

      const teacherSlot =
        `${row.teacher_id}-${row.day_of_week}-${row.period_number}`;

      if (existingTeacherSlots.has(teacherSlot)) {
        validationErrors.push(
          `Row ${rowNumber}: teacher already has another class during this period.`,
        );
      }

      if (previewTeacherSlots.has(teacherSlot)) {
        validationErrors.push(
          `Row ${rowNumber}: teacher is assigned twice in the preview.`,
        );
      }

      previewTeacherSlots.add(teacherSlot);

      const assignmentKey =
        `${row.teacher_id}-${row.subject_name}`;

      if (!assignmentKeys.has(assignmentKey)) {
        validationErrors.push(
          `Row ${rowNumber}: ${row.subject_name} is not assigned to the selected teacher for ${className} ${sectionName} in ${academicYearName}.`,
        );
      }
    }

    for (const assignment of selectedAssignments) {
      const required = Number(
        assignment.periods_per_week ?? 0,
      );

      if (required <= 0) continue;

      const previewCount = generated.filter(
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

      const existingCount = existingTimetableResult.data.filter(
        (row) =>
          row.section_id === sectionId &&
          row.subject_id &&
          subjectIds.has(row.subject_id),
      ).length;

      const totalAfterPublish = existingCount + previewCount;

      if (totalAfterPublish !== required) {
        validationErrors.push(
          `${assignment.subject_name}: required ${required} periods/week, existing ${existingCount}, preview contains ${previewCount}, total after publish ${totalAfterPublish}.`,
        );
      }
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          published: false,
          error:
            "Publish blocked because the timetable changed or the preview is invalid.",
          validation_errors: validationErrors,
        },
        { status: 409 },
      );
    }

    const rowsToInsert = generated.map((row) => {
      const timing = timingByPeriod.get(row.period_number);

      return {
        id: `timetable_${crypto.randomUUID()}`,
        tenantId,
        academic_year_id: academicYearId,
        class_id: classId,
        section_id: sectionId,
        subject_id: row.subject_id,
        teacher_id: row.teacher_id,
        day_of_week: row.day_of_week,
        period_number: row.period_number,
        start_time:
          row.start_time ?? timing?.start_time ?? null,
        end_time:
          row.end_time ?? timing?.end_time ?? null,
        status: "ACTIVE",
      };
    });

    const { data: inserted, error: insertError } =
      await supabaseAdmin
        .from("timetables")
        .insert(rowsToInsert)
        .select(
          "id,subject_id,teacher_id,day_of_week,period_number,start_time,end_time,status",
        );

    if (insertError) {
      console.error(
        "Timetable publish insert error:",
        insertError,
      );

      return NextResponse.json(
        {
          published: false,
          error:
            "Timetable could not be published. No changes should be considered published.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json({
      published: true,
      message:
        "Timetable preview approved and published successfully.",
      inserted_count:
        inserted?.length ?? rowsToInsert.length,
      inserted: inserted ?? [],
    });
  } catch (error) {
    console.error(
      "Timetable publish error:",
      error,
    );

    return NextResponse.json(
      {
        published: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to publish timetable.",
      },
      { status: 500 },
    );
  }
}
