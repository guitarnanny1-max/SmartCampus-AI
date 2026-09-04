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
      error: NextResponse.json(
        { error: "Authentication required." },
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
      error: NextResponse.json(
        { error: "Application user has no tenant." },
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

    const { supabaseAdmin, tenantId } = context;
    const url = new URL(request.url);

    const academicYearId =
      url.searchParams.get("academic_year_id")?.trim() ?? "";
    const classId =
      url.searchParams.get("class_id")?.trim() ?? "";
    const sectionId =
      url.searchParams.get("section_id")?.trim() ?? "";

    if (!academicYearId || !classId || !sectionId) {
      return NextResponse.json(
        {
          error:
            "academic_year_id, class_id and section_id are required.",
        },
        { status: 400 },
      );
    }

    const [
      yearResult,
      classResult,
      sectionResult,
      subjectsResult,
      assignmentsResult,
      timingsResult,
      timetableResult,
    ] = await Promise.all([
      supabaseAdmin
        .from("academic_years")
        .select("id, name")
        .eq("id", academicYearId)
        .eq("tenantId", tenantId)
        .maybeSingle(),

      supabaseAdmin
        .from("classes")
        .select("id, name")
        .eq("id", classId)
        .eq("tenantId", tenantId)
        .maybeSingle(),

      supabaseAdmin
        .from("sections")
        .select("id, name, class_id")
        .eq("id", sectionId)
        .eq("tenantId", tenantId)
        .maybeSingle(),

      supabaseAdmin
        .from("section_subjects")
        .select(`
          subject_id,
          subjects (
            id,
            name,
            code
          )
        `)
        .eq("tenantId", tenantId)
        .eq("class_id", classId)
        .eq("section_id", sectionId)
        .eq("status", "ACTIVE"),

      supabaseAdmin
        .from("teacher_assignments")
        .select(`
          id,
          teacher_id,
          subject_name,
          class_name,
          section_name,
          academic_year,
          periods_per_week,
          assignment_type,
          status
        `)
        .eq("class_name", "")
        .limit(1),

      supabaseAdmin
        .from("period_timings")
        .select(`
          id,
          period_number,
          name,
          start_time,
          end_time,
          is_break,
          status
        `)
        .eq("tenantId", tenantId)
        .eq("academic_year_id", academicYearId)
        .eq("status", "ACTIVE")
        .order("period_number", { ascending: true }),

      supabaseAdmin
        .from("timetables")
        .select(`
          id,
          section_id,
          subject_id,
          teacher_id,
          day_of_week,
          period_number,
          status
        `)
        .eq("tenantId", tenantId)
        .eq("academic_year_id", academicYearId)
        .eq("status", "ACTIVE"),
    ]);

    if (yearResult.error) throw yearResult.error;
    if (classResult.error) throw classResult.error;
    if (sectionResult.error) throw sectionResult.error;
    if (subjectsResult.error) throw subjectsResult.error;
    if (assignmentsResult.error) throw assignmentsResult.error;
    if (timingsResult.error) throw timingsResult.error;
    if (timetableResult.error) throw timetableResult.error;

    if (!yearResult.data || !classResult.data || !sectionResult.data) {
      return NextResponse.json(
        { error: "Invalid academic year, class or section." },
        { status: 400 },
      );
    }

    if (sectionResult.data.class_id !== classId) {
      return NextResponse.json(
        { error: "Section does not belong to the selected class." },
        { status: 400 },
      );
    }

    /*
     * Load teacher assignments separately because the initial query above
     * deliberately avoids assuming a tenant column exists on the legacy
     * teacher_assignments table.
     */
    const { data: assignments, error: teacherAssignmentError } =
      await supabaseAdmin
        .from("teacher_assignments")
        .select(`
          id,
          teacher_id,
          subject_name,
          class_name,
          section_name,
          academic_year,
          periods_per_week,
          assignment_type,
          status
        `)
        .eq("class_name", classResult.data.name)
        .eq("section_name", sectionResult.data.name)
        .eq("academic_year", yearResult.data.name)
        .eq("status", "ACTIVE");

    if (teacherAssignmentError) {
      throw teacherAssignmentError;
    }

    const subjectRows = subjectsResult.data ?? [];
    const activeSubjects = subjectRows
      .map((row: any) => {
        const subject = Array.isArray(row.subjects)
          ? row.subjects[0]
          : row.subjects;

        return subject
          ? {
              id: subject.id,
              name: subject.name,
              code: subject.code,
            }
          : null;
      })
      .filter(Boolean) as Array<{
        id: string;
        name: string;
        code: string | null;
      }>;

    const subjectMap = new Map(
      activeSubjects.map((subject) => [
        subject.name.trim().toLowerCase(),
        subject,
      ]),
    );

    const assignmentBySubject = new Map<
      string,
      {
        teacherId: string;
        periodsPerWeek: number;
      }
    >();

    for (const assignment of assignments ?? []) {
      if (!assignment.teacher_id || !assignment.subject_name) {
        continue;
      }

      const key = assignment.subject_name.trim().toLowerCase();

      if (!subjectMap.has(key)) {
        continue;
      }

      const periods = Number(assignment.periods_per_week ?? 0);

      if (periods <= 0) {
        continue;
      }

      const existing = assignmentBySubject.get(key);

      if (!existing || assignment.assignment_type === "PRIMARY") {
        assignmentBySubject.set(key, {
          teacherId: assignment.teacher_id,
          periodsPerWeek: periods,
        });
      }
    }

    const timings = (timingsResult.data ?? [])
      .filter((timing) => !timing.is_break)
      .sort(
        (a, b) =>
          a.period_number - b.period_number,
      );

    if (timings.length === 0) {
      return NextResponse.json(
        {
          error:
            "No active teaching periods are configured for this academic year.",
        },
        { status: 400 },
      );
    }

    const existingRows = timetableResult.data ?? [];

    const sectionOccupied = new Set<string>();
    const teacherOccupied = new Set<string>();

    for (const row of existingRows) {
      const key = `${row.day_of_week}-${row.period_number}`;

      if (row.section_id === sectionId) {
        sectionOccupied.add(key);
      }

      if (row.teacher_id) {
        teacherOccupied.add(
          `${row.teacher_id}-${row.day_of_week}-${row.period_number}`,
        );
      }
    }

    const days = [
      { value: 1, name: "Monday" },
      { value: 2, name: "Tuesday" },
      { value: 3, name: "Wednesday" },
      { value: 4, name: "Thursday" },
      { value: 5, name: "Friday" },
      { value: 6, name: "Saturday" },
    ];

    const generated: Array<{
      subject_id: string;
      subject_name: string;
      teacher_id: string;
      day_of_week: number;
      day_name: string;
      period_number: number;
      period_name: string;
      start_time: string;
      end_time: string;
    }> = [];

    const simulatedSection = new Set(sectionOccupied);
    const simulatedTeachers = new Set(teacherOccupied);

    /*
     * Subjects with the largest weekly requirement are scheduled first.
     * This makes the generator deterministic and helps prevent highly
     * constrained subjects from being left until the end.
     */
    const workload = Array.from(assignmentBySubject.entries())
      .map(([key, assignment]) => {
        const subject = subjectMap.get(key)!;

        const alreadyScheduled = existingRows.filter(
          (row) => row.section_id === sectionId &&
            row.subject_id === subject.id,
        ).length;

        return {
          key,
          subject,
          teacherId: assignment.teacherId,
          required: Math.max(
            0,
            assignment.periodsPerWeek - alreadyScheduled,
          ),
        };
      })
      .filter((item) => item.required > 0)
      .sort((a, b) => b.required - a.required);

    for (const item of workload) {
      let remaining = item.required;

      /*
       * Prefer spreading the same subject across different days.
       */
      for (const day of days) {
        if (remaining <= 0) break;

        for (const timing of timings) {
          if (remaining <= 0) break;

          const slotKey =
            `${day.value}-${timing.period_number}`;

          const teacherKey =
            `${item.teacherId}-${day.value}-${timing.period_number}`;

          if (simulatedSection.has(slotKey)) {
            continue;
          }

          if (simulatedTeachers.has(teacherKey)) {
            continue;
          }

          generated.push({
            subject_id: item.subject.id,
            subject_name: item.subject.name,
            teacher_id: item.teacherId,
            day_of_week: day.value,
            day_name: day.name,
            period_number: timing.period_number,
            period_name: timing.name,
            start_time: timing.start_time,
            end_time: timing.end_time,
          });

          simulatedSection.add(slotKey);
          simulatedTeachers.add(teacherKey);

          remaining--;
        }
      }
    }

    const unresolved = workload
      .map((item) => {
        const generatedCount = generated.filter(
          (row) => row.subject_id === item.subject.id,
        ).length;

        return {
          subject_id: item.subject.id,
          subject_name: item.subject.name,
          required_additional_periods: item.required,
          generated_periods: generatedCount,
          missing_periods: Math.max(
            0,
            item.required - generatedCount,
          ),
        };
      })
      .filter((item) => item.missing_periods > 0);

    return NextResponse.json({
      success: true,
      mode: "PREVIEW",
      academic_year: yearResult.data,
      class: classResult.data,
      section: sectionResult.data,
      generated,
      unresolved,
      summary: {
        subjects_processed: workload.length,
        periods_generated: generated.length,
        subjects_with_unresolved_periods: unresolved.length,
      },
      message:
        "Preview generated successfully. No timetable records were created or modified.",
    });
  } catch (error) {
    console.error(
      "GET /api/timetable/auto-generate error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to generate timetable preview.",
      },
      { status: 500 },
    );
  }
}
