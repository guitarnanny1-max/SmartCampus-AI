import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

async function getAuthContext() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !publishableKey || !serviceRoleKey) {
    return {
      error: NextResponse.json(
        { error: "Supabase configuration is incomplete." },
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
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Cookies may be read-only.
          }
        },
      },
    }
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
      .select("id, tenantId, email, name, role")
      .eq("email", authUser.email)
      .maybeSingle();

  if (userError) {
    console.error("Marks User lookup error:", userError);

    return {
      error: NextResponse.json(
        { error: "Unable to load application user." },
        { status: 500 }
      ),
    };
  }

  if (!appUser?.tenantId) {
    return {
      error: NextResponse.json(
        { error: "Application user has no tenant." },
        { status: 403 }
      ),
    };
  }

  return {
    supabaseAdmin,
    tenantId: appUser.tenantId,
  };
}

async function getExam(
  supabaseAdmin: any,
  tenantId: string,
  examId: string
) {
  const { data, error } = await supabaseAdmin
    .from("exams")
    .select(
      "id, name, academic_year_id, exam_type, start_date, end_date, status"
    )
    .eq("id", examId)
    .eq("tenantId", tenantId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function getExamSubject(
  supabaseAdmin: any,
  tenantId: string,
  examId: string,
  examSubjectId: string
) {
  const { data, error } = await supabaseAdmin
    .from("exam_subjects")
    .select(
      "id, exam_id, subject_id, max_marks, pass_marks, exam_date, start_time, end_time"
    )
    .eq("id", examSubjectId)
    .eq("exam_id", examId)
    .eq("tenantId", tenantId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Calculate grade and grade point from percentage.
 *
 * Uses the tenant's grading_scales table.
 * The matching range is:
 * min_percentage <= percentage <= max_percentage
 */
async function calculateGrade(
  supabaseAdmin: any,
  tenantId: string,
  percentage: number
) {
  const { data: scales, error } = await supabaseAdmin
    .from("grading_scales")
    .select(
      "id, name, min_percentage, max_percentage, grade, grade_point"
    )
    .eq("tenantId", tenantId)
    .order("min_percentage", { ascending: true });

  if (error) {
    throw error;
  }

  const matchingScale = (scales ?? []).find((scale: any) => {
    const min = Number(scale.min_percentage);
    const max = Number(scale.max_percentage);

    return percentage >= min && percentage <= max;
  });

  if (!matchingScale) {
    return {
      grade: null,
      gradePoint: null,
    };
  }

  return {
    grade: matchingScale.grade,
    gradePoint:
      matchingScale.grade_point === null ||
      matchingScale.grade_point === undefined
        ? null
        : Number(matchingScale.grade_point),
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await getAuthContext();

    if ("error" in context) {
      return context.error;
    }

    const { supabaseAdmin, tenantId } = context;
    const { id: examId } = await params;

    const exam = await getExam(
      supabaseAdmin,
      tenantId,
      examId
    );

    if (!exam) {
      return NextResponse.json(
        { error: "Exam not found." },
        { status: 404 }
      );
    }

    const url = new URL(request.url);

    const examSubjectId =
      (url.searchParams.get("exam_subject_id") || "").trim();

    const academicYearId =
      (url.searchParams.get("academic_year_id") || "").trim();

    const classId =
      (url.searchParams.get("class_id") || "").trim();

    const sectionId =
      (url.searchParams.get("section_id") || "").trim();

    if (!examSubjectId) {
      return NextResponse.json(
        { error: "Exam subject is required." },
        { status: 400 }
      );
    }

    const examSubject = await getExamSubject(
      supabaseAdmin,
      tenantId,
      examId,
      examSubjectId
    );

    if (!examSubject) {
      return NextResponse.json(
        { error: "Exam subject not found." },
        { status: 404 }
      );
    }

    if (
      academicYearId &&
      academicYearId !== exam.academic_year_id
    ) {
      return NextResponse.json(
        {
          error:
            "Academic year does not match the examination.",
        },
        { status: 400 }
      );
    }

    let enrollmentQuery = supabaseAdmin
      .from("student_enrollments")
      .select(
        `
          id,
          student_id,
          academic_year_id,
          class_id,
          section_id,
          roll_number,
          status,
          enrolled_at
        `
      )
      .eq("tenantId", tenantId)
      .eq("academic_year_id", exam.academic_year_id)
      .eq("status", "ACTIVE")
      .order("roll_number", { ascending: true });

    if (classId) {
      enrollmentQuery = enrollmentQuery.eq(
        "class_id",
        classId
      );
    }

    if (sectionId) {
      enrollmentQuery = enrollmentQuery.eq(
        "section_id",
        sectionId
      );
    }

    const {
      data: enrollments,
      error: enrollmentError,
    } = await enrollmentQuery;

    if (enrollmentError) {
      console.error(
        "Marks enrollment lookup error:",
        enrollmentError
      );

      return NextResponse.json(
        {
          error: "Unable to load enrolled students.",
          details: enrollmentError.message,
        },
        { status: 500 }
      );
    }

    const enrollmentRows = enrollments ?? [];

    const studentIds = [
      ...new Set(
        enrollmentRows
          .map((row: any) => row.student_id)
          .filter(Boolean)
      ),
    ];

    let students: Array<{
      id: string;
      name: string;
      rollNumber: string | null;
      grade: string | null;
      parentEmail: string | null;
      status: string;
    }> = [];

    if (studentIds.length > 0) {
      const {
        data: studentData,
        error: studentError,
      } = await supabaseAdmin
        .from("Student")
        .select(
          `
            id,
            name,
            "rollNumber",
            grade,
            "parentEmail",
            status
          `
        )
        .eq("tenantId", tenantId)
        .in("id", studentIds);

      if (studentError) {
        console.error(
          "Marks student lookup error:",
          studentError
        );

        return NextResponse.json(
          {
            error: "Unable to load students.",
            details: studentError.message,
          },
          { status: 500 }
        );
      }

      students = studentData ?? [];
    }

    const {
      data: marks,
      error: marksError,
    } = await supabaseAdmin
      .from("student_marks")
      .select(
        `
          id,
          tenantId,
          exam_id,
          student_id,
          subject_id,
          exam_subject_id,
          marks_obtained,
          max_marks,
          grade,
          remarks,
          created_at,
          updated_at
        `
      )
      .eq("tenantId", tenantId)
      .eq("exam_id", examId)
      .eq("exam_subject_id", examSubjectId);

    if (marksError) {
      console.error(
        "Marks lookup error:",
        marksError
      );

      return NextResponse.json(
        {
          error: "Unable to load student marks.",
          details: marksError.message,
        },
        { status: 500 }
      );
    }

    const studentMap = new Map(
      students.map((student) => [
        student.id,
        student,
      ])
    );

    const marksMap = new Map(
      (marks ?? []).map((mark: any) => [
        mark.student_id,
        mark,
      ])
    );

    const rows = enrollmentRows
      .map((enrollment: any) => {
        const student = studentMap.get(
          enrollment.student_id
        );

        if (!student) {
          return null;
        }

        return {
          enrollment_id: enrollment.id,
          student_id: student.id,
          student_name: student.name,
          roll_number:
            enrollment.roll_number ??
            student.rollNumber ??
            null,
          grade_class: student.grade ?? null,
          marks:
            marksMap.get(student.id) ?? null,
        };
      })
      .filter(Boolean);

    return NextResponse.json({
      success: true,
      exam,
      examSubject,
      students: rows,
      total: rows.length,
    });
  } catch (error) {
    console.error(
      "GET /api/exams/[id]/marks error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load student marks.",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await getAuthContext();

    if ("error" in context) {
      return context.error;
    }

    const { supabaseAdmin, tenantId } = context;
    const { id: examId } = await params;

    const exam = await getExam(
      supabaseAdmin,
      tenantId,
      examId
    );

    if (!exam) {
      return NextResponse.json(
        { error: "Exam not found." },
        { status: 404 }
      );
    }

    if (exam.status === "PUBLISHED") {
      return NextResponse.json(
        {
          success: false,
          error: "This examination is published and marks are locked.",
        },
        { status: 409 }
      );
    }

    let body: Record<string, unknown>;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const examSubjectId =
      typeof body.exam_subject_id === "string"
        ? body.exam_subject_id.trim()
        : "";

    const studentId =
      typeof body.student_id === "string"
        ? body.student_id.trim()
        : "";

    const remarks =
      typeof body.remarks === "string"
        ? body.remarks.trim() || null
        : null;

    const rawMarks = body.marks_obtained;

    if (!examSubjectId || !studentId) {
      return NextResponse.json(
        {
          error:
            "Exam subject and student are required.",
        },
        { status: 400 }
      );
    }

    const marks =
      rawMarks === null ||
      rawMarks === undefined ||
      rawMarks === ""
        ? null
        : Number(rawMarks);

    const examSubject = await getExamSubject(
      supabaseAdmin,
      tenantId,
      examId,
      examSubjectId
    );

    if (!examSubject) {
      return NextResponse.json(
        { error: "Exam subject not found." },
        { status: 404 }
      );
    }

    if (marks !== null) {
      if (!Number.isFinite(marks)) {
        return NextResponse.json(
          { error: "Marks must be a valid number." },
          { status: 400 }
        );
      }

      if (
        marks < 0 ||
        marks > Number(examSubject.max_marks)
      ) {
        return NextResponse.json(
          {
            error: `Marks must be between 0 and ${examSubject.max_marks}.`,
          },
          { status: 400 }
        );
      }
    }

    const { data: enrollment, error: enrollmentError } =
      await supabaseAdmin
        .from("student_enrollments")
        .select(
          `
            id,
            student_id,
            academic_year_id,
            class_id,
            section_id,
            status
          `
        )
        .eq("tenantId", tenantId)
        .eq("student_id", studentId)
        .eq("academic_year_id", exam.academic_year_id)
        .eq("status", "ACTIVE")
        .maybeSingle();

    if (enrollmentError) {
      throw enrollmentError;
    }

    if (!enrollment) {
      return NextResponse.json(
        {
          error:
            "Student is not actively enrolled for this examination academic year.",
        },
        { status: 400 }
      );
    }

    const { data: existing, error: existingError } =
      await supabaseAdmin
        .from("student_marks")
        .select("id")
        .eq("tenantId", tenantId)
        .eq("exam_id", examId)
        .eq("exam_subject_id", examSubjectId)
        .eq("student_id", studentId)
        .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    if (existing) {
      return NextResponse.json(
        {
          error:
            "Marks already exist for this student and subject. Use PATCH to update them.",
        },
        { status: 409 }
      );
    }

    let grade: string | null = null;
    let gradePoint: number | null = null;

    if (marks !== null && Number(examSubject.max_marks) > 0) {
      const percentage =
        (marks / Number(examSubject.max_marks)) * 100;

      const calculated = await calculateGrade(
        supabaseAdmin,
        tenantId,
        percentage
      );

      grade = calculated.grade;
      gradePoint = calculated.gradePoint;
    }

    const id = `student_mark_${crypto.randomUUID()}`;

    const { data, error } = await supabaseAdmin
      .from("student_marks")
      .insert({
        id,
        tenantId,
        exam_id: examId,
        student_id: studentId,
        subject_id: examSubject.subject_id,
        exam_subject_id: examSubjectId,
        marks_obtained: marks,
        max_marks: examSubject.max_marks,
        grade,
        remarks,
      })
      .select(
        `
          id,
          exam_id,
          student_id,
          subject_id,
          exam_subject_id,
          marks_obtained,
          max_marks,
          grade,
          remarks,
          created_at,
          updated_at
        `
      )
      .single();

    if (error) {
      console.error(
        "Student mark insert error:",
        error
      );

      return NextResponse.json(
        {
          error: "Unable to save student marks.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        mark: data,
        gradePoint,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "POST /api/exams/[id]/marks error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to save student marks.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await getAuthContext();

    if ("error" in context) {
      return context.error;
    }

    const { supabaseAdmin, tenantId } = context;
    const { id: examId } = await params;

    const exam = await getExam(
      supabaseAdmin,
      tenantId,
      examId
    );

    if (!exam) {
      return NextResponse.json(
        { error: "Exam not found." },
        { status: 404 }
      );
    }

    if (exam.status === "PUBLISHED") {
      return NextResponse.json(
        {
          success: false,
          error: "This examination is published and marks are locked.",
        },
        { status: 409 }
      );
    }

    let body: Record<string, unknown>;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const markId =
      typeof body.id === "string"
        ? body.id.trim()
        : "";

    const rawMarks = body.marks_obtained;

    const remarks =
      typeof body.remarks === "string"
        ? body.remarks.trim() || null
        : body.remarks === null
          ? null
          : undefined;

    if (!markId) {
      return NextResponse.json(
        { error: "Mark record id is required." },
        { status: 400 }
      );
    }

    const { data: existing, error: existingError } =
      await supabaseAdmin
        .from("student_marks")
        .select(
          `
            id,
            exam_id,
            student_id,
            exam_subject_id,
            max_marks,
            marks_obtained,
            remarks
          `
        )
        .eq("id", markId)
        .eq("tenantId", tenantId)
        .eq("exam_id", examId)
        .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    if (!existing) {
      return NextResponse.json(
        { error: "Mark record not found." },
        { status: 404 }
      );
    }

    const examSubject = await getExamSubject(
      supabaseAdmin,
      tenantId,
      examId,
      existing.exam_subject_id
    );

    if (!examSubject) {
      return NextResponse.json(
        { error: "Exam subject not found." },
        { status: 404 }
      );
    }

    let marks = existing.marks_obtained;

    if (rawMarks !== undefined) {
      marks =
        rawMarks === null ||
        rawMarks === ""
          ? null
          : Number(rawMarks);

      if (
        marks !== null &&
        (!Number.isFinite(marks) ||
          marks < 0 ||
          marks > Number(examSubject.max_marks))
      ) {
        return NextResponse.json(
          {
            error: `Marks must be between 0 and ${examSubject.max_marks}.`,
          },
          { status: 400 }
        );
      }
    }

    let grade: string | null = null;
    let gradePoint: number | null = null;

    if (
      marks !== null &&
      Number(examSubject.max_marks) > 0
    ) {
      const percentage =
        (Number(marks) /
          Number(examSubject.max_marks)) *
        100;

      const calculated = await calculateGrade(
        supabaseAdmin,
        tenantId,
        percentage
      );

      grade = calculated.grade;
      gradePoint = calculated.gradePoint;
    }

    const updateData: Record<string, unknown> = {
      marks_obtained: marks,
      max_marks: examSubject.max_marks,
      grade,
      updated_at: new Date().toISOString(),
    };

    if (remarks !== undefined) {
      updateData.remarks = remarks;
    }

    const { data, error } = await supabaseAdmin
      .from("student_marks")
      .update(updateData)
      .eq("id", markId)
      .eq("tenantId", tenantId)
      .eq("exam_id", examId)
      .select(
        `
          id,
          exam_id,
          student_id,
          subject_id,
          exam_subject_id,
          marks_obtained,
          max_marks,
          grade,
          remarks,
          created_at,
          updated_at
        `
      )
      .single();

    if (error) {
      console.error(
        "Student mark update error:",
        error
      );

      return NextResponse.json(
        {
          error: "Unable to update student marks.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      mark: data,
      gradePoint,
    });
  } catch (error) {
    console.error(
      "PATCH /api/exams/[id]/marks error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to update student marks.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await getAuthContext();

    if ("error" in context) {
      return context.error;
    }

    const { supabaseAdmin, tenantId } = context;
    const { id: examId } = await params;

    const url = new URL(request.url);

    const markId =
      (url.searchParams.get("id") || "").trim();

    if (!markId) {
      return NextResponse.json(
        { error: "Mark record id is required." },
        { status: 400 }
      );
    }

    const { data: existing, error: existingError } =
      await supabaseAdmin
        .from("student_marks")
        .select("id")
        .eq("id", markId)
        .eq("tenantId", tenantId)
        .eq("exam_id", examId)
        .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    if (!existing) {
      return NextResponse.json(
        { error: "Mark record not found." },
        { status: 404 }
      );
    }

    const { error } = await supabaseAdmin
      .from("student_marks")
      .delete()
      .eq("id", markId)
      .eq("tenantId", tenantId)
      .eq("exam_id", examId);

    if (error) {
      console.error(
        "Student mark delete error:",
        error
      );

      return NextResponse.json(
        {
          error: "Unable to delete student marks.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Student marks removed successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE /api/exams/[id]/marks error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to delete student marks.",
      },
      { status: 500 }
    );
  }
}
