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
        { success: false, error: "Supabase configuration is incomplete." },
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
            // Read-only request context.
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
    return {
      error: NextResponse.json(
        {
          success: false,
          error: "Unable to load application user.",
          details: userError.message,
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
          error: "User is not associated with a tenant.",
        },
        { status: 403 }
      ),
    };
  }

  return {
    supabaseAdmin,
    tenantId: appUser.tenantId as string,
    user: appUser,
  };
}

async function calculateGrade(
  supabaseAdmin: any,
  tenantId: string,
  percentage: number
) {
  const { data, error } = await supabaseAdmin
    .from("grading_scales")
    .select(
      "id, name, min_percentage, max_percentage, grade, grade_point, description"
    )
    .eq("tenantId", tenantId)
    .lte("min_percentage", percentage)
    .gte("max_percentage", percentage)
    .order("min_percentage", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ?? null;
}

export async function GET(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const auth = await getAuthContext();

    if ("error" in auth) {
      return auth.error;
    }

    const { supabaseAdmin, tenantId } = auth;
    const { id: examId } = await context.params;

    const url = new URL(request.url);

    const studentId = url.searchParams.get("student_id");
    const classId = url.searchParams.get("class_id");
    const sectionId = url.searchParams.get("section_id");

    if (!studentId && (!classId || !sectionId)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Provide student_id or both class_id and section_id.",
        },
        { status: 400 }
      );
    }

    const { data: exam, error: examError } =
      await supabaseAdmin
        .from("exams")
        .select(
          "id, tenantId, academic_year_id, name, exam_type, start_date, end_date, status"
        )
        .eq("id", examId)
        .eq("tenantId", tenantId)
        .maybeSingle();

    if (examError) throw examError;

    if (!exam) {
      return NextResponse.json(
        {
          success: false,
          error: "Examination not found.",
        },
        { status: 404 }
      );
    }

    let studentIds: string[] = [];

    if (studentId) {
      studentIds = [studentId];
    } else {
      const { data: enrollments, error: enrollmentError } =
        await supabaseAdmin
          .from("student_enrollments")
          .select("student_id")
          .eq("tenantId", tenantId)
          .eq("academic_year_id", exam.academic_year_id)
          .eq("class_id", classId)
          .eq("section_id", sectionId)
          .eq("status", "ACTIVE");

      if (enrollmentError) throw enrollmentError;

      studentIds = (enrollments ?? []).map(
        (item: any) => item.student_id
      );
    }

    if (studentIds.length === 0) {
      return NextResponse.json({
        success: true,
        exam,
        students: [],
      });
    }

    const { data: students, error: studentsError } =
      await supabaseAdmin
        .from("Student")
        .select(
          "id, tenantId, name, parentEmail, status"
        )
        .eq("tenantId", tenantId)
        .in("id", studentIds);

    if (studentsError) throw studentsError;

    const { data: examSubjects, error: subjectError } =
      await supabaseAdmin
        .from("exam_subjects")
        .select(
          "id, subject_id, max_marks, pass_marks, exam_date, start_time, end_time"
        )
        .eq("tenantId", tenantId)
        .eq("exam_id", examId)
        .order("exam_date", { ascending: true });

    if (subjectError) throw subjectError;

    const subjectIds = [
      ...new Set(
        (examSubjects ?? []).map(
          (item: any) => item.subject_id
        )
      ),
    ];

    const { data: subjects, error: subjectsError } =
      subjectIds.length > 0
        ? await supabaseAdmin
            .from("subjects")
            .select("id, name, code")
            .eq("tenantId", tenantId)
            .in("id", subjectIds)
        : { data: [], error: null };

    if (subjectsError) throw subjectsError;

    const { data: marks, error: marksError } =
      await supabaseAdmin
        .from("student_marks")
        .select(
          "id, student_id, subject_id, exam_subject_id, marks_obtained, max_marks, grade, remarks"
        )
        .eq("tenantId", tenantId)
        .eq("exam_id", examId)
        .in("student_id", studentIds);

    if (marksError) throw marksError;

    const subjectMap = new Map(
      (subjects ?? []).map((subject: any) => [
        subject.id,
        subject,
      ])
    );

    const marksMap = new Map(
      (marks ?? []).map((mark: any) => [
        `${mark.student_id}:${mark.exam_subject_id}`,
        mark,
      ])
    );

    const results = (students ?? []).map((student: any) => {
      const subjectResults = (examSubjects ?? []).map(
        (examSubject: any) => {
          const mark = marksMap.get(
            `${student.id}:${examSubject.id}`
          );

          const maxMarks = Number(
            mark?.max_marks ?? examSubject.max_marks ?? 0
          );

          const marksObtained =
            mark?.marks_obtained != null
              ? Number(mark.marks_obtained)
              : null;

          const percentage =
            marksObtained !== null && maxMarks > 0
              ? (marksObtained / maxMarks) * 100
              : null;

          return {
            exam_subject_id: examSubject.id,
            subject_id: examSubject.subject_id,
            subject: subjectMap.get(examSubject.subject_id) ?? null,
            max_marks: maxMarks,
            pass_marks: Number(examSubject.pass_marks ?? 0),
            marks_obtained: marksObtained,
            percentage,
            grade: mark?.grade ?? null,
            remarks: mark?.remarks ?? null,
            entered: !!mark,
          };
        }
      );

      const enteredSubjects = subjectResults.filter(
        (item: any) => item.marks_obtained !== null
      );

      const totalMarks = enteredSubjects.reduce(
        (sum: number, item: any) =>
          sum + Number(item.marks_obtained),
        0
      );

      const totalMaxMarks = enteredSubjects.reduce(
        (sum: number, item: any) =>
          sum + Number(item.max_marks),
        0
      );

      const percentage =
        totalMaxMarks > 0
          ? (totalMarks / totalMaxMarks) * 100
          : null;

      const passed =
        enteredSubjects.length > 0 &&
        enteredSubjects.every(
          (item: any) =>
            Number(item.marks_obtained) >=
            Number(item.pass_marks)
        );

      return {
        student: {
          id: student.id,
          name: student.name,
          admission_number: null,
          parentEmail: student.parentEmail,
          status: student.status,
        },
        subjects: subjectResults,
        summary: {
          subjects_total: subjectResults.length,
          subjects_entered: enteredSubjects.length,
          total_marks: totalMarks,
          total_max_marks: totalMaxMarks,
          percentage,
          passed:
            enteredSubjects.length === 0
              ? null
              : passed,
        },
      };
    });

    for (const result of results) {
      if (result.summary.percentage !== null) {
        const scale = await calculateGrade(
          supabaseAdmin,
          tenantId,
          result.summary.percentage
        );

        (result.summary as any).grade =
          scale?.grade ?? null;

        (result.summary as any).grade_point =
          scale?.grade_point ?? null;
      } else {
        (result.summary as any).grade = null;
        (result.summary as any).grade_point = null;
      }
    }

    return NextResponse.json({
      success: true,
      exam,
      students: results,
    });
  } catch (error: any) {
    console.error("Results GET error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load examination results.",
        details: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
