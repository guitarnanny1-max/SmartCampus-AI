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
        { error: "Supabase environment is not configured." },
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
            // Request cookies may be read-only.
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

  const { data: appUser, error: userError } = await supabaseAdmin
    .from("User")
    .select("id, tenantId, email, name, role")
    .eq("email", authUser.email)
    .maybeSingle();

  if (userError) {
    console.error("Exam Subjects User lookup error:", userError);

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
  const result = await supabaseAdmin
    .from("exams")
    .select(
      "id, name, academic_year_id, exam_type, start_date, end_date, status"
    )
    .eq("id", examId)
    .eq("tenantId", tenantId)
    .maybeSingle();

  if (!result) {
    throw new Error(
      "Unable to query examination record."
    );
  }

  const { data, error } = result;

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return data;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthContext();

    if ("error" in auth) {
      return auth.error;
    }

    const { tenantId, supabaseAdmin } = auth;
    const { id: examId } = await context.params;

    let exam;

    try {
      exam = await getExam(
        supabaseAdmin,
        tenantId,
        examId
      );
    } catch (error) {
      console.error("Exam lookup error:", error);

      return NextResponse.json(
        {
          success: false,
          error: "Unable to load examination.",
          details:
            error instanceof Error
              ? error.message
              : "Unknown examination lookup error.",
        },
        { status: 500 }
      );
    }

    if (!exam) {
      return NextResponse.json(
        {
          success: false,
          error: "Examination not found.",
        },
        { status: 404 }
      );
    }

    const { data: examSubjects, error: subjectsError } =
      await supabaseAdmin
        .from("exam_subjects")
        .select("*")
        .eq("tenantId", tenantId)
        .eq("exam_id", examId)
        .order("exam_date", { ascending: true })
        .order("start_time", { ascending: true });

    if (subjectsError) {
      console.error(
        "Exam subjects GET error:",
        subjectsError
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to load examination subjects.",
          details: subjectsError.message,
        },
        { status: 500 }
      );
    }

    const enrichedExamSubjects = [];

    for (const item of examSubjects || []) {
      let subject = null;

      if (item.subject_id) {
        const { data: subjectData, error: subjectError } =
          await supabaseAdmin
            .from("subjects")
            .select(`
              id,
              "tenantId",
              name,
              code,
              status
            `)
            .eq("tenantId", tenantId)
            .eq("id", item.subject_id)
            .maybeSingle();

        if (subjectError) {
          console.error(
            "Subject lookup error:",
            subjectError
          );
        } else {
          subject = subjectData;
        }
      }

      enrichedExamSubjects.push({
        ...item,
        subject,
      });
    }

    return NextResponse.json({
      success: true,
      exam,
      examSubjects: enrichedExamSubjects,
      total: enrichedExamSubjects.length,
    });
  } catch (error) {
    console.error(
      "GET /api/exams/[id]/subjects error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to load examination subjects.",
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

    const exam = await getExam(supabaseAdmin, tenantId, examId);

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
          error: "This examination is published and subjects are locked.",
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

    const subjectId =
      typeof body.subject_id === "string"
        ? body.subject_id.trim()
        : "";

    const maxMarks = Number(body.max_marks);
    const passMarks = Number(body.pass_marks);

    const examDate =
      typeof body.exam_date === "string" && body.exam_date.trim()
        ? body.exam_date.trim()
        : null;

    const startTime =
      typeof body.start_time === "string" && body.start_time.trim()
        ? body.start_time.trim()
        : null;

    const endTime =
      typeof body.end_time === "string" && body.end_time.trim()
        ? body.end_time.trim()
        : null;

    if (!subjectId) {
      return NextResponse.json(
        { error: "Subject is required." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(maxMarks) || maxMarks <= 0) {
      return NextResponse.json(
        { error: "Maximum marks must be greater than 0." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(passMarks) || passMarks < 0) {
      return NextResponse.json(
        { error: "Pass marks must be 0 or greater." },
        { status: 400 }
      );
    }

    if (passMarks > maxMarks) {
      return NextResponse.json(
        { error: "Pass marks cannot exceed maximum marks." },
        { status: 400 }
      );
    }

    const { data: subject, error: subjectError } = await supabaseAdmin
      .from("subjects")
      .select("id, name, code, status")
      .eq("id", subjectId)
      .eq("tenantId", tenantId)
      .maybeSingle();

    if (subjectError) {
      console.error("Exam subject lookup error:", subjectError);

      return NextResponse.json(
        {
          error: "Unable to verify subject.",
          details: subjectError.message,
        },
        { status: 500 }
      );
    }

    if (!subject) {
      return NextResponse.json(
        { error: "Subject not found." },
        { status: 404 }
      );
    }

    if (String(subject.status).toUpperCase() !== "ACTIVE") {
      return NextResponse.json(
        { error: "Only active subjects can be added to an exam." },
        { status: 400 }
      );
    }

    const { data: existing, error: existingError } =
      await supabaseAdmin
        .from("exam_subjects")
        .select("id")
        .eq("tenantId", tenantId)
        .eq("exam_id", examId)
        .eq("subject_id", subjectId)
        .maybeSingle();

    if (existingError) {
      console.error("Exam subject duplicate check error:", existingError);

      return NextResponse.json(
        {
          error: "Unable to check existing exam subject.",
          details: existingError.message,
        },
        { status: 500 }
      );
    }

    if (existing) {
      return NextResponse.json(
        { error: "This subject is already added to the exam." },
        { status: 409 }
      );
    }

    const id = `exam_subject_${crypto.randomUUID()}`;

    const { data, error } = await supabaseAdmin
      .from("exam_subjects")
      .insert({
        id,
        tenantId,
        exam_id: examId,
        subject_id: subjectId,
        max_marks: maxMarks,
        pass_marks: passMarks,
        exam_date: examDate,
        start_time: startTime,
        end_time: endTime,
      })
      .select(`
        id,
        "tenantId",
        exam_id,
        subject_id,
        max_marks,
        pass_marks,
        exam_date,
        start_time,
        end_time,
        created_at,
        updated_at
      `)
      .single();

    if (error) {
      console.error("Exam Subjects POST error:", error);

      return NextResponse.json(
        {
          error: "Unable to add subject to exam.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        examSubject: data,
        subject,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/exams/[id]/subjects error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to add subject to exam.",
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

    const exam = await getExam(supabaseAdmin, tenantId, examId);

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
          error: "This examination is published and subjects are locked.",
        },
        { status: 409 }
      );
    }

    const body = await request.json();

    const examSubjectId =
      typeof body.exam_subject_id === "string"
        ? body.exam_subject_id.trim()
        : "";

    if (!examSubjectId) {
      return NextResponse.json(
        { error: "Exam subject ID is required." },
        { status: 400 }
      );
    }

    const { data: current, error: currentError } =
      await supabaseAdmin
        .from("exam_subjects")
        .select("id, max_marks, pass_marks")
        .eq("id", examSubjectId)
        .eq("tenantId", tenantId)
        .eq("exam_id", examId)
        .maybeSingle();

    if (currentError) {
      throw currentError;
    }

    if (!current) {
      return NextResponse.json(
        { error: "Exam subject not found." },
        { status: 404 }
      );
    }

    const updates: Record<string, unknown> = {};

    if (body.max_marks !== undefined) {
      const value = Number(body.max_marks);

      if (!Number.isFinite(value) || value <= 0) {
        return NextResponse.json(
          { error: "Maximum marks must be greater than 0." },
          { status: 400 }
        );
      }

      updates.max_marks = value;
    }

    if (body.pass_marks !== undefined) {
      const value = Number(body.pass_marks);

      if (!Number.isFinite(value) || value < 0) {
        return NextResponse.json(
          { error: "Pass marks must be 0 or greater." },
          { status: 400 }
        );
      }

      updates.pass_marks = value;
    }

    if (body.exam_date !== undefined) {
      updates.exam_date = body.exam_date || null;
    }

    if (body.start_time !== undefined) {
      updates.start_time = body.start_time || null;
    }

    if (body.end_time !== undefined) {
      updates.end_time = body.end_time || null;
    }

    const finalMaxMarks =
      updates.max_marks !== undefined
        ? Number(updates.max_marks)
        : Number(current.max_marks);

    const finalPassMarks =
      updates.pass_marks !== undefined
        ? Number(updates.pass_marks)
        : Number(current.pass_marks);

    if (finalPassMarks > finalMaxMarks) {
      return NextResponse.json(
        { error: "Pass marks cannot exceed maximum marks." },
        { status: 400 }
      );
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No changes supplied." },
        { status: 400 }
      );
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from("exam_subjects")
      .update(updates)
      .eq("id", examSubjectId)
      .eq("tenantId", tenantId)
      .eq("exam_id", examId)
      .select(`
        id,
        "tenantId",
        exam_id,
        subject_id,
        max_marks,
        pass_marks,
        exam_date,
        start_time,
        end_time,
        created_at,
        updated_at
      `)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      examSubject: data,
    });
  } catch (error) {
    console.error("PATCH /api/exams/[id]/subjects error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to update exam subject.",
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

    const exam = await getExam(supabaseAdmin, tenantId, examId);

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
          error: "This examination is published and subjects are locked.",
        },
        { status: 409 }
      );
    }

    const url = new URL(request.url);
    const examSubjectId = url.searchParams.get("exam_subject_id");

    if (!examSubjectId) {
      return NextResponse.json(
        { error: "Exam subject ID is required." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("exam_subjects")
      .delete()
      .eq("id", examSubjectId)
      .eq("tenantId", tenantId)
      .eq("exam_id", examId);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE /api/exams/[id]/subjects error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to remove exam subject.",
      },
      { status: 500 }
    );
  }
}
