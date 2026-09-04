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

  if (profileError) throw profileError;

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
        { error: "There are no preview periods to publish." },
        { status: 400 },
      );
    }

    /*
     * Re-check everything against the current database state.
     * The browser preview may be stale by the time Publish is clicked.
     */

    const [
      sectionSubjectsResult,
      periodTimingsResult,
      existingTimetableResult,
    ] = await Promise.all([
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
        .from("timetables")
        .select(
          "id,section_id,subject_id,teacher_id,day_of_week,period_number",
        )
        .eq("tenantId", tenantId)
        .eq("academic_year_id", academicYearId)
        .eq("status", "ACTIVE"),
    ]);

    if (sectionSubjectsResult.error)
      throw sectionSubjectsResult.error;

    if (periodTimingsResult.error)
      throw periodTimingsResult.error;

    if (existingTimetableResult.error)
      throw existingTimetableResult.error;

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

    const existingSectionSlots = new Set(
      (existingTimetableResult.data ?? [])
        .filter((item) => item.section_id === sectionId)
        .map(
          (item) =>
            `${item.day_of_week}-${item.period_number}`,
        ),
    );

    const existingTeacherSlots = new Set(
      (existingTimetableResult.data ?? [])
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

    /*
     * Insert only after the complete server-side validation succeeds.
     */

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
      inserted_count: inserted?.length ?? rowsToInsert.length,
      inserted: inserted ?? [],
    });
  } catch (error) {
    console.error(
      "POST /api/timetable/auto-generate/publish",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to publish timetable.",
      },
      { status: 500 },
    );
  }
}
