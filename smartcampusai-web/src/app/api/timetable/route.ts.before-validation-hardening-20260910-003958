import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

type AnySupabaseClient = SupabaseClient<any, any, any>;

type AcademicYearRecord = {
  id: string;
  name: string;
  status: string | null;
};

type ClassRecord = {
  id: string;
  name: string;
  status: string | null;
};

type SectionRecord = {
  id: string;
  name: string;
  class_id: string;
  status: string | null;
};

type SectionSubjectRecord = {
  id: string;
  class_id: string;
  section_id: string;
  subject_id: string;
  status: string | null;
  subjects: {
    id: string;
    name: string;
    code: string | null;
    status: string | null;
  } | null;
};

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

async function validateContext(
  supabaseAdmin: AnySupabaseClient,
  tenantId: string,
  academicYearId: string,
  classId: string,
  sectionId: string,
) {
  const { data: academicYear, error: yearError } = await supabaseAdmin
    .from("academic_years")
    .select("id, name, status")
    .eq("id", academicYearId)
    .eq("tenantId", tenantId)
    .maybeSingle() as {
      data: AcademicYearRecord | null;
      error: any;
    };

  if (yearError) throw yearError;
  if (!academicYear) {
    return { error: "Academic year not found." };
  }

  const { data: classRecord, error: classError } = await supabaseAdmin
    .from("classes")
    .select("id, name, status")
    .eq("id", classId)
    .eq("tenantId", tenantId)
    .maybeSingle() as {
      data: ClassRecord | null;
      error: any;
    };

  if (classError) throw classError;
  if (!classRecord) {
    return { error: "Class not found." };
  }

  const { data: section, error: sectionError } = await supabaseAdmin
    .from("sections")
    .select("id, name, class_id, status")
    .eq("id", sectionId)
    .eq("tenantId", tenantId)
    .maybeSingle() as {
      data: SectionRecord | null;
      error: any;
    };

  if (sectionError) throw sectionError;

  if (!section) {
    return { error: "Section not found." };
  }

  if (section.class_id !== classId) {
    return {
      error: "Section does not belong to the selected class.",
    };
  }

  return {
    academicYear,
    classRecord,
    section,
  };
}

async function validateSubject(
  supabaseAdmin: AnySupabaseClient,
  tenantId: string,
  classId: string,
  sectionId: string,
  subjectId: string,
) {
  const { data, error } = await supabaseAdmin
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
        code,
        status
      )
    `)
    .eq("tenantId", tenantId)
    .eq("class_id", classId)
    .eq("section_id", sectionId)
    .eq("subject_id", subjectId)
    .eq("status", "ACTIVE")
    .maybeSingle() as {
      data: SectionSubjectRecord | null;
      error: any;
    };

  if (error) throw error;

  if (!data) {
    return {
      error: "This subject is not linked to the selected section.",
    };
  }

  return { assignment: data };
}

async function validateTeacher(
  supabaseAdmin: AnySupabaseClient,
  teacherId: string | null,
  subjectName: string,
  className: string,
  sectionName: string,
  academicYearName: string,
) {
  if (!teacherId) {
    return { valid: true };
  }

  const { data, error } = await supabaseAdmin
    .from("teacher_assignments")
    .select("id, teacher_id, status")
    .eq("teacher_id", teacherId)
    .eq("subject_name", subjectName)
    .eq("class_name", className)
    .eq("section_name", sectionName)
    .eq("academic_year", academicYearName)
    .eq("status", "ACTIVE")
    .limit(1);

  if (error) throw error;

  if (!data || data.length === 0) {
    return {
      error:
        "This teacher is not actively assigned to this subject and section.",
    };
  }

  return { valid: true };
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

    if (!academicYearId || !classId || !sectionId) {
      return NextResponse.json(
        {
          error:
            "academic_year_id, class_id and section_id are required.",
        },
        { status: 400 },
      );
    }

    const contextValidation = await validateContext(
      supabaseAdmin,
      tenantId,
      academicYearId,
      classId,
      sectionId,
    );

    if ("error" in contextValidation) {
      return NextResponse.json(
        { error: contextValidation.error },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("timetables")
      .select(`
        id,
        "tenantId",
        academic_year_id,
        class_id,
        section_id,
        subject_id,
        teacher_id,
        day_of_week,
        period_number,
        start_time,
        end_time,
        status,
        created_at,
        updated_at,
        subjects (
          id,
          name,
          code
        )
      `)
      .eq("tenantId", tenantId)
      .eq("academic_year_id", academicYearId)
      .eq("class_id", classId)
      .eq("section_id", sectionId)
      .order("day_of_week", { ascending: true })
      .order("period_number", { ascending: true });

    if (error) {
      console.error("Timetable GET error:", error);

      return NextResponse.json(
        {
          error: "Unable to load timetable.",
          details: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      timetables: data ?? [],
      total: data?.length ?? 0,
    });
  } catch (error) {
    console.error("GET /api/timetable error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load timetable.",
      },
      { status: 500 },
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
        { error: "Invalid JSON request body." },
        { status: 400 },
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
      typeof body.teacher_id === "string" && body.teacher_id.trim()
        ? body.teacher_id.trim()
        : null;

    const dayOfWeek = Number(body.day_of_week);
    const periodNumber = Number(body.period_number);

    const startTime =
      typeof body.start_time === "string" && body.start_time.trim()
        ? body.start_time.trim()
        : null;

    const endTime =
      typeof body.end_time === "string" && body.end_time.trim()
        ? body.end_time.trim()
        : null;

    if (
      !academicYearId ||
      !classId ||
      !sectionId ||
      !subjectId ||
      !Number.isInteger(dayOfWeek) ||
      !Number.isInteger(periodNumber)
    ) {
      return NextResponse.json(
        {
          error:
            "academic_year_id, class_id, section_id, subject_id, day_of_week and period_number are required.",
        },
        { status: 400 },
      );
    }

    if (dayOfWeek < 1 || dayOfWeek > 6) {
      return NextResponse.json(
        { error: "day_of_week must be between 1 and 6." },
        { status: 400 },
      );
    }

    if (periodNumber < 1 || periodNumber > 20) {
      return NextResponse.json(
        { error: "period_number must be between 1 and 20." },
        { status: 400 },
      );
    }

    const { data: breakTiming, error: breakTimingError } =
      await supabaseAdmin
        .from("period_timings")
        .select("id, name, is_break")
        .eq("tenantId", tenantId)
        .eq("academic_year_id", academicYearId)
        .eq("period_number", periodNumber)
        .eq("status", "ACTIVE")
        .maybeSingle();

    if (breakTimingError) throw breakTimingError;

    if (breakTiming?.is_break) {
      return NextResponse.json(
        { error: "Cannot schedule a class during a break period." },
        { status: 409 },
      );
    }

    const contextValidation = await validateContext(
      supabaseAdmin,
      tenantId,
      academicYearId,
      classId,
      sectionId,
    );

    if ("error" in contextValidation) {
      return NextResponse.json(
        { error: contextValidation.error },
        { status: 400 },
      );
    }

    const subjectValidation = await validateSubject(
      supabaseAdmin,
      tenantId,
      classId,
      sectionId,
      subjectId,
    );

    if ("error" in subjectValidation) {
      return NextResponse.json(
        { error: subjectValidation.error },
        { status: 400 },
      );
    }

    const subject = subjectValidation.assignment.subjects as {
      id: string;
      name: string;
      code: string | null;
      status: string;
    } | null;

    if (!subject) {
      return NextResponse.json(
        { error: "Unable to resolve timetable subject." },
        { status: 400 },
      );
    }

    const teacherValidation = await validateTeacher(
      supabaseAdmin,
      teacherId,
      subject.name,
      contextValidation.classRecord.name,
      contextValidation.section.name,
      contextValidation.academicYear.name,
    );

    if ("error" in teacherValidation) {
      return NextResponse.json(
        { error: teacherValidation.error },
        { status: 400 },
      );
    }

    const { data: periodAssignment, error: periodAssignmentError } =
      await supabaseAdmin
        .from("teacher_assignments")
        .select("periods_per_week")
        .eq("teacher_id", teacherId)
        .eq("subject_name", subject.name)
        .eq("class_name", contextValidation.classRecord.name)
        .eq("section_name", contextValidation.section.name)
        .eq("academic_year", contextValidation.academicYear.name)
        .eq("status", "ACTIVE")
        .limit(1)
        .maybeSingle();

    if (periodAssignmentError) throw periodAssignmentError;

    const allowedPeriods = Number(periodAssignment?.periods_per_week ?? 0);

    if (allowedPeriods > 0) {
      const { count: scheduledPeriods, error: scheduledPeriodsError } =
        await supabaseAdmin
          .from("timetables")
          .select("id", { count: "exact", head: true })
          .eq("tenantId", tenantId)
          .eq("academic_year_id", academicYearId)
          .eq("section_id", sectionId)
          .eq("subject_id", subjectId)
          .eq("status", "ACTIVE");

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

    const { data: existingPeriod, error: existingPeriodError } =
      await supabaseAdmin
        .from("timetables")
        .select("id")
        .eq("tenantId", tenantId)
        .eq("academic_year_id", academicYearId)
        .eq("section_id", sectionId)
        .eq("day_of_week", dayOfWeek)
        .eq("period_number", periodNumber)
        .maybeSingle();

    if (existingPeriodError) throw existingPeriodError;

    if (existingPeriod) {
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
        await supabaseAdmin
          .from("timetables")
          .select("id")
          .eq("tenantId", tenantId)
          .eq("academic_year_id", academicYearId)
          .eq("teacher_id", teacherId)
          .eq("day_of_week", dayOfWeek)
          .eq("period_number", periodNumber)
          .maybeSingle();

      if (teacherConflictError) throw teacherConflictError;

      if (teacherConflict) {
        return NextResponse.json(
          {
            error:
              "This teacher is already assigned to another section during that period.",
          },
          { status: 409 },
        );
      }
    }

    const id = `timetable_${crypto.randomUUID()}`;

    const { data, error } = await supabaseAdmin
      .from("timetables")
      .insert({
        id,
        tenantId,
        academic_year_id: academicYearId,
        class_id: classId,
        section_id: sectionId,
        subject_id: subjectId,
        teacher_id: teacherId,
        day_of_week: dayOfWeek,
        period_number: periodNumber,
        start_time: startTime,
        end_time: endTime,
        status: "ACTIVE",
      })
      .select(`
        id,
        "tenantId",
        academic_year_id,
        class_id,
        section_id,
        subject_id,
        teacher_id,
        day_of_week,
        period_number,
        start_time,
        end_time,
        status,
        created_at,
        updated_at,
        subjects (
          id,
          name,
          code
        )
      `)
      .single();

    if (error) {
      console.error("Timetable POST error:", error);

      if (error.code === "23505") {
        return NextResponse.json(
          {
            error:
              "This section already has a timetable entry for that day and period.",
          },
          { status: 409 },
        );
      }

      return NextResponse.json(
        {
          error: "Unable to create timetable entry.",
          details: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        timetable: data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/timetable error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create timetable entry.",
      },
      { status: 500 },
    );
  }
}
