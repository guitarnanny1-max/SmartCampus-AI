import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

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

  const { data: appUser, error: userError } = await supabaseAdmin
    .from("User")
    .select(`
      id,
      "tenantId",
      email,
      name,
      role
    `)
    .eq("email", authUser.email)
    .maybeSingle();

  if (userError) {
    console.error("Timetable User lookup error:", userError);

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


type RouteContext = {
  params: Promise<{ id: string }>;
};

type TimetableRow = {
  id: string;
  tenantId: string;
  academic_year_id: string;
  class_id: string;
  section_id: string;
  subject_id: string;
  teacher_id: string | null;
  day_of_week: number;
  period_number: number;
  start_time: string | null;
  end_time: string | null;
  status: string;
};

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function validatePayload(body: Record<string, unknown>) {
  const errors: string[] = [];

  if (body.subject_id !== undefined && typeof body.subject_id !== "string") {
    errors.push("subject_id must be a string.");
  }

  if (
    body.teacher_id !== undefined &&
    body.teacher_id !== null &&
    typeof body.teacher_id !== "string"
  ) {
    errors.push("teacher_id must be a string or null.");
  }

  if (
    body.day_of_week !== undefined &&
    (!Number.isInteger(Number(body.day_of_week)) ||
      Number(body.day_of_week) < 1 ||
      Number(body.day_of_week) > 6)
  ) {
    errors.push("day_of_week must be between 1 and 6.");
  }

  if (
    body.period_number !== undefined &&
    (!Number.isInteger(Number(body.period_number)) ||
      Number(body.period_number) < 1 ||
      Number(body.period_number) > 20)
  ) {
    errors.push("period_number must be between 1 and 20.");
  }

  if (
    body.start_time !== undefined &&
    body.start_time !== null &&
    typeof body.start_time !== "string"
  ) {
    errors.push("start_time must be a string or null.");
  }

  if (
    body.end_time !== undefined &&
    body.end_time !== null &&
    typeof body.end_time !== "string"
  ) {
    errors.push("end_time must be a string or null.");
  }

  return errors;
}

export async function GET(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const auth = await getAuthContext();

    if (!auth?.tenantId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await context.params;
    const supabase = getServiceClient();

    const { data, error } = await supabase
      .from("timetables")
      .select("*")
      .eq("id", id)
      .eq("tenantId", auth.tenantId)
      .maybeSingle();

    if (error) {
      console.error("GET /api/timetable/[id] error:", error);

      return NextResponse.json(
        { error: "Failed to load timetable period." },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Timetable period not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      timetable: data,
    });
  } catch (error) {
    console.error("GET /api/timetable/[id] exception:", error);

    return NextResponse.json(
      { error: "Failed to load timetable period." },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const auth = await getAuthContext();

    if (!auth?.tenantId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await context.params;
    const body = (await request.json()) as Record<string, unknown>;
    const validationErrors = validatePayload(body);

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: validationErrors.join(" ") },
        { status: 400 },
      );
    }

    const supabase = getServiceClient();

    const { data: existing, error: existingError } = await supabase
      .from("timetables")
      .select("*")
      .eq("id", id)
      .eq("tenantId", auth.tenantId)
      .maybeSingle<TimetableRow>();

    if (existingError) {
      console.error("PATCH existing timetable error:", existingError);

      return NextResponse.json(
        { error: "Failed to load timetable period." },
        { status: 500 },
      );
    }

    if (!existing) {
      return NextResponse.json(
        { error: "Timetable period not found." },
        { status: 404 },
      );
    }

    const subjectId =
      body.subject_id !== undefined
        ? String(body.subject_id)
        : existing.subject_id;

    const teacherId =
      body.teacher_id !== undefined
        ? body.teacher_id === null || body.teacher_id === ""
          ? null
          : String(body.teacher_id)
        : existing.teacher_id;

    const dayOfWeek =
      body.day_of_week !== undefined
        ? Number(body.day_of_week)
        : existing.day_of_week;

    const periodNumber =
      body.period_number !== undefined
        ? Number(body.period_number)
        : existing.period_number;

    const startTime =
      body.start_time !== undefined
        ? body.start_time === null || body.start_time === ""
          ? null
          : String(body.start_time)
        : existing.start_time;

    const endTime =
      body.end_time !== undefined
        ? body.end_time === null || body.end_time === ""
          ? null
          : String(body.end_time)
        : existing.end_time;

    const { data: breakTiming, error: breakTimingError } =
      await supabase
        .from("period_timings")
        .select("id, name, is_break")
        .eq("tenantId", auth.tenantId)
        .eq("academic_year_id", existing.academic_year_id)
        .eq("period_number", periodNumber)
        .eq("status", "ACTIVE")
        .maybeSingle();

    if (breakTimingError) {
      console.error("PATCH break period validation error:", breakTimingError);
      return NextResponse.json(
        { error: "Failed to validate period timing." },
        { status: 500 },
      );
    }

    if (breakTiming?.is_break) {
      return NextResponse.json(
        { error: "Cannot schedule a class during a break period." },
        { status: 409 },
      );
    }

    const { data: sectionSubject, error: sectionSubjectError } =
      await supabase
        .from("section_subjects")
        .select("id")
        .eq("tenantId", auth.tenantId)
        .eq("section_id", existing.section_id)
        .eq("class_id", existing.class_id)
        .eq("subject_id", subjectId)
        .eq("status", "ACTIVE")
        .maybeSingle();

    if (sectionSubjectError) {
      console.error(
        "PATCH section subject validation error:",
        sectionSubjectError,
      );

      return NextResponse.json(
        { error: "Failed to validate section subject." },
        { status: 500 },
      );
    }

    if (!sectionSubject) {
      return NextResponse.json(
        {
          error:
            "The selected subject is not assigned to this section.",
        },
        { status: 400 },
      );
    }

    const { data: patchSubject, error: patchSubjectError } =
      await supabase
        .from("subjects")
        .select("id, name")
        .eq("id", subjectId)
        .eq("tenantId", auth.tenantId)
        .maybeSingle();

    if (patchSubjectError) {
      console.error("PATCH subject lookup error:", patchSubjectError);
      return NextResponse.json(
        { error: "Failed to validate timetable subject." },
        { status: 500 },
      );
    }

    if (!patchSubject) {
      return NextResponse.json(
        { error: "Timetable subject not found." },
        { status: 400 },
      );
    }

    const { data: patchClass, error: patchClassError } =
      await supabase
        .from("classes")
        .select("id, name")
        .eq("id", existing.class_id)
        .eq("tenantId", auth.tenantId)
        .maybeSingle();

    if (patchClassError) throw patchClassError;

    const { data: patchSection, error: patchSectionError } =
      await supabase
        .from("sections")
        .select("id, name")
        .eq("id", existing.section_id)
        .eq("tenantId", auth.tenantId)
        .maybeSingle();

    if (patchSectionError) throw patchSectionError;

    const { data: patchAcademicYear, error: patchAcademicYearError } =
      await supabase
        .from("academic_years")
        .select("id, name")
        .eq("id", existing.academic_year_id)
        .eq("tenantId", auth.tenantId)
        .maybeSingle();

    if (patchAcademicYearError) throw patchAcademicYearError;

    const { data: periodAssignment, error: periodAssignmentError } =
      await supabase
        .from("teacher_assignments")
        .select("periods_per_week")
        .eq("teacher_id", teacherId ?? "")
        .eq("subject_name", patchSubject.name)
        .eq("class_name", patchClass?.name ?? "")
        .eq("section_name", patchSection?.name ?? "")
        .eq("academic_year", patchAcademicYear?.name ?? "")
        .eq("status", "ACTIVE")
        .limit(1)
        .maybeSingle();

    if (periodAssignmentError) throw periodAssignmentError;

    const allowedPeriods = Number(periodAssignment?.periods_per_week ?? 0);

    if (allowedPeriods > 0) {
      const { count: scheduledPeriods, error: scheduledPeriodsError } =
        await supabase
          .from("timetables")
          .select("id", { count: "exact", head: true })
          .eq("tenantId", auth.tenantId)
          .eq("academic_year_id", existing.academic_year_id)
          .eq("section_id", existing.section_id)
          .eq("subject_id", subjectId)
          .eq("status", "ACTIVE")
          .neq("id", id);

      if (scheduledPeriodsError) throw scheduledPeriodsError;

      if ((scheduledPeriods ?? 0) >= allowedPeriods) {
        return NextResponse.json(
          {
            error: `This subject is already scheduled for ${scheduledPeriods ?? 0} of ${allowedPeriods} allowed periods per week.`,
          },
          { status: 409 },
        );
      }
    }

    if (teacherId) {
      const { data: teacher, error: teacherError } = await supabase
        .from("teacher_assignments")
        .select("id")
        .eq("teacher_id", teacherId)
        .eq("subject_name", (
          await supabase
            .from("subjects")
            .select("name")
            .eq("id", subjectId)
            .eq("tenantId", auth.tenantId)
            .maybeSingle()
        ).data?.name ?? "")
        .eq("class_name", (
          await supabase
            .from("classes")
            .select("name")
            .eq("id", existing.class_id)
            .eq("tenantId", auth.tenantId)
            .maybeSingle()
        ).data?.name ?? "")
        .eq("section_name", (
          await supabase
            .from("sections")
            .select("name")
            .eq("id", existing.section_id)
            .eq("tenantId", auth.tenantId)
            .maybeSingle()
        ).data?.name ?? "")
        .eq("academic_year", (
          await supabase
            .from("academic_years")
            .select("name")
            .eq("id", existing.academic_year_id)
            .eq("tenantId", auth.tenantId)
            .maybeSingle()
        ).data?.name ?? "")
        .eq("status", "ACTIVE")
        .maybeSingle();

      if (teacherError) {
        console.error("PATCH teacher validation error:", teacherError);

        return NextResponse.json(
          { error: "Failed to validate teacher assignment." },
          { status: 500 },
        );
      }

      if (!teacher) {
        return NextResponse.json(
          {
            error:
              "The selected teacher is not assigned to this class, section, subject and academic year.",
          },
          { status: 400 },
        );
      }
    }

    const { data: sectionConflict, error: sectionConflictError } =
      await supabase
        .from("timetables")
        .select("id")
        .eq("tenantId", auth.tenantId)
        .eq("section_id", existing.section_id)
        .eq("academic_year_id", existing.academic_year_id)
        .eq("day_of_week", dayOfWeek)
        .eq("period_number", periodNumber)
        .neq("id", id)
        .maybeSingle();

    if (sectionConflictError) {
      console.error(
        "PATCH section conflict error:",
        sectionConflictError,
      );

      return NextResponse.json(
        { error: "Failed to check timetable conflicts." },
        { status: 500 },
      );
    }

    if (sectionConflict) {
      return NextResponse.json(
        {
          error:
            "This section already has a timetable entry for that day and period.",
        },
        { status: 409 },
      );
    }

    if (teacherId) {
      const { data: teacherConflict, error: teacherConflictError } =
        await supabase
          .from("timetables")
          .select("id")
          .eq("tenantId", auth.tenantId)
          .eq("academic_year_id", existing.academic_year_id)
          .eq("teacher_id", teacherId)
          .eq("day_of_week", dayOfWeek)
          .eq("period_number", periodNumber)
          .neq("id", id)
          .maybeSingle();

      if (teacherConflictError) {
        console.error(
          "PATCH teacher conflict error:",
          teacherConflictError,
        );

        return NextResponse.json(
          { error: "Failed to check teacher conflicts." },
          { status: 500 },
        );
      }

      if (teacherConflict) {
        return NextResponse.json(
          {
            error:
              "This teacher already has a timetable entry for that day and period.",
          },
          { status: 409 },
        );
      }
    }

    const { data: updated, error: updateError } = await supabase
      .from("timetables")
      .update({
        subject_id: subjectId,
        teacher_id: teacherId,
        day_of_week: dayOfWeek,
        period_number: periodNumber,
        start_time: startTime,
        end_time: endTime,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("tenantId", auth.tenantId)
      .select("*")
      .single();

    if (updateError) {
      console.error("PATCH timetable update error:", updateError);

      return NextResponse.json(
        { error: "Failed to update timetable period." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      timetable: updated,
    });
  } catch (error) {
    console.error("PATCH /api/timetable/[id] exception:", error);

    return NextResponse.json(
      { error: "Failed to update timetable period." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const auth = await getAuthContext();

    if (!auth?.tenantId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await context.params;
    const supabase = getServiceClient();

    const { data: existing, error: existingError } = await supabase
      .from("timetables")
      .select("id")
      .eq("id", id)
      .eq("tenantId", auth.tenantId)
      .maybeSingle();

    if (existingError) {
      console.error("DELETE existing timetable error:", existingError);

      return NextResponse.json(
        { error: "Failed to find timetable period." },
        { status: 500 },
      );
    }

    if (!existing) {
      return NextResponse.json(
        { error: "Timetable period not found." },
        { status: 404 },
      );
    }

    const { error: deleteError } = await supabase
      .from("timetables")
      .delete()
      .eq("id", id)
      .eq("tenantId", auth.tenantId);

    if (deleteError) {
      console.error("DELETE timetable error:", deleteError);

      return NextResponse.json(
        { error: "Failed to delete timetable period." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Timetable period deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE /api/timetable/[id] exception:", error);

    return NextResponse.json(
      { error: "Failed to delete timetable period." },
      { status: 500 },
    );
  }
}
