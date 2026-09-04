import { NextResponse } from "next/server";
import crypto from "crypto";
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
          } catch {
            // Request cookies may be read-only.
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
    .eq("email", authUser.email)
    .maybeSingle();

  if (userError) {
    console.error("Suggestion User lookup error:", userError);
    return {
      error: NextResponse.json(
        { error: "Unable to load application user." },
        { status: 500 },
      ),
    };
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
      (url.searchParams.get("academic_year_id") || "").trim();
    const classId =
      (url.searchParams.get("class_id") || "").trim();
    const sectionId =
      (url.searchParams.get("section_id") || "").trim();
    const subjectId =
      (url.searchParams.get("subject_id") || "").trim();

    if (!academicYearId || !classId || !sectionId || !subjectId) {
      return NextResponse.json(
        {
          error:
            "academic_year_id, class_id, section_id and subject_id are required.",
        },
        { status: 400 },
      );
    }

    const { data: sectionSubject, error: sectionSubjectError } =
      await supabaseAdmin
        .from("section_subjects")
        .select(`
          id,
          class_id,
          section_id,
          subject_id,
          status,
          subjects (
            id,
            name,
            code
          )
        `)
        .eq("tenantId", tenantId)
        .eq("class_id", classId)
        .eq("section_id", sectionId)
        .eq("subject_id", subjectId)
        .eq("status", "ACTIVE")
        .maybeSingle();

    if (sectionSubjectError) {
      throw sectionSubjectError;
    }

    if (!sectionSubject) {
      return NextResponse.json(
        { error: "This subject is not linked to the selected section." },
        { status: 400 },
      );
    }

    const subject = Array.isArray(sectionSubject.subjects)
      ? sectionSubject.subjects[0]
      : sectionSubject.subjects;

    if (!subject?.name) {
      return NextResponse.json(
        { error: "Unable to determine the selected subject." },
        { status: 400 },
      );
    }

    const [
      { data: academicYear, error: yearError },
      { data: classRecord, error: classError },
      { data: section, error: sectionError },
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
    ]);

    if (yearError) throw yearError;
    if (classError) throw classError;
    if (sectionError) throw sectionError;

    if (!academicYear || !classRecord || !section) {
      return NextResponse.json(
        { error: "Invalid academic year, class or section." },
        { status: 400 },
      );
    }

    if (section.class_id !== classId) {
      return NextResponse.json(
        { error: "Section does not belong to the selected class." },
        { status: 400 },
      );
    }

    const { data: assignments, error: assignmentError } =
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
        .not("teacher_id", "is", null)
        .eq("subject_name", subject.name)
        .eq("class_name", classRecord.name)
        .eq("section_name", section.name)
        .eq("academic_year", academicYear.name)
        .eq("status", "ACTIVE");

    if (assignmentError) {
      throw assignmentError;
    }

    const teacherIds = (assignments ?? [])
      .map((assignment) => assignment.teacher_id)
      .filter(Boolean);

    if (teacherIds.length === 0) {
      return NextResponse.json({
        success: true,
        suggestions: [],
        message:
          "No active teacher assignment was found for this subject and section.",
      });
    }

    const { data: timings, error: timingError } = await supabaseAdmin
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
      .order("period_number", { ascending: true });

    if (timingError) {
      throw timingError;
    }

    const { data: timetableRows, error: timetableError } =
      await supabaseAdmin
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
        .eq("status", "ACTIVE");

    if (timetableError) {
      throw timetableError;
    }

    const suggestions: Array<{
      id: string;
      day_of_week: number;
      day_name: string;
      period_number: number;
      period_name: string;
      start_time: string;
      end_time: string;
      teacher_id: string;
      score: number;
      reason: string;
    }> = [];

    const days = [
      { value: 1, label: "Monday" },
      { value: 2, label: "Tuesday" },
      { value: 3, label: "Wednesday" },
      { value: 4, label: "Thursday" },
      { value: 5, label: "Friday" },
      { value: 6, label: "Saturday" },
    ];

    for (const day of days) {
      for (const timing of timings ?? []) {
        if (timing.is_break) {
          continue;
        }

        const sectionOccupied = (timetableRows ?? []).some(
          (row) =>
            row.section_id === sectionId &&
            row.day_of_week === day.value &&
            row.period_number === timing.period_number,
        );

        if (sectionOccupied) {
          continue;
        }

        const availableTeacher = teacherIds.find((teacherId) => {
          return !(timetableRows ?? []).some(
            (row) =>
              row.teacher_id === teacherId &&
              row.day_of_week === day.value &&
              row.period_number === timing.period_number,
          );
        });

        if (!availableTeacher) {
          continue;
        }

        suggestions.push({
          id: crypto
            .createHash("sha1")
            .update(
              `${sectionId}-${subjectId}-${day.value}-${timing.period_number}`,
            )
            .digest("hex")
            .slice(0, 16),
          day_of_week: day.value,
          day_name: day.label,
          period_number: timing.period_number,
          period_name: timing.name,
          start_time: timing.start_time,
          end_time: timing.end_time,
          teacher_id: availableTeacher,
          score: 100 - timing.period_number,
          reason: "Section and assigned teacher are available.",
        });
      }
    }

    suggestions.sort((a, b) => b.score - a.score);

    return NextResponse.json({
      success: true,
      subject: {
        id: subject.id,
        name: subject.name,
      },
      suggestions: suggestions.slice(0, 12),
      total: suggestions.length,
    });
  } catch (error) {
    console.error("GET /api/timetable/suggestions error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to generate timetable suggestions.",
      },
      { status: 500 },
    );
  }
}
