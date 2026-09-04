import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { logTeacherActivity } from "@/lib/teacherActivity";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase server configuration is missing.");
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get("teacher_id");

    const supabase = getAdminClient();

    let query = supabase
      .from("teacher_assignments")
      .select(
        "id, teacher_id, subject_name, class_name, section_name, academic_year, periods_per_week, assignment_type, status, created_at"
      )
      .order("created_at", { ascending: false });

    if (teacherId) {
      query = query.eq("teacher_id", teacherId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Teacher assignments GET error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      assignments: data ?? [],
      total: data?.length ?? 0,
    });
  } catch (error) {
    console.error("Teacher assignments GET error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load assignments.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const teacherId = String(body?.teacher_id ?? "").trim();
    const subjectName = String(body?.subject_name ?? "").trim();

    if (!teacherId) {
      return NextResponse.json(
        { error: "Teacher ID is required." },
        { status: 400 }
      );
    }

    if (!subjectName) {
      return NextResponse.json(
        { error: "Subject name is required." },
        { status: 400 }
      );
    }

    const periods = Number(body?.periods_per_week ?? 0);

    if (!Number.isInteger(periods) || periods < 0) {
      return NextResponse.json(
        { error: "Periods per week must be a valid number." },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();

    // Prevent accidental duplicate teaching assignments.
    const { data: duplicateAssignment, error: duplicateError } =
      await supabase
        .from("teacher_assignments")
        .select("id")
        .eq("teacher_id", teacherId)
        .eq("subject_name", subjectName)
        .eq(
          "class_name",
          String(body?.class_name ?? "").trim() || null
        )
        .eq(
          "section_name",
          String(body?.section_name ?? "").trim() || null
        )
        .eq(
          "academic_year",
          String(body?.academic_year ?? "").trim() || null
        )
        .maybeSingle();

    if (duplicateError) {
      console.error(
        "Teacher assignment duplicate check error:",
        duplicateError
      );

      return NextResponse.json(
        { error: duplicateError.message },
        { status: 500 }
      );
    }

    if (duplicateAssignment) {
      return NextResponse.json(
        {
          error:
            "This teaching assignment already exists. Use Edit to change the weekly periods or assignment details.",
        },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from("teacher_assignments")
      .insert({
        id: crypto.randomUUID(),
        teacher_id: teacherId,
        subject_name: subjectName,
        class_name: String(body?.class_name ?? "").trim() || null,
        section_name:
          String(body?.section_name ?? "").trim() || null,
        academic_year:
          String(body?.academic_year ?? "").trim() || null,
        periods_per_week: periods,
        assignment_type:
          String(body?.assignment_type ?? "PRIMARY")
            .trim()
            .toUpperCase(),
        status:
          String(body?.status ?? "ACTIVE")
            .trim()
            .toUpperCase(),
      })
      .select(
        "id, teacher_id, subject_name, class_name, section_name, academic_year, periods_per_week, assignment_type, status, created_at"
      )
      .single();

    if (error) {
      console.error("Teacher assignments POST error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    await logTeacherActivity({
      teacherId,
      action: "TEACHER_ASSIGNMENT_CREATED",
      description: `Teaching assignment created for ${subjectName}.`,
      metadata: {
        assignment_id: data?.id ?? null,
        subject_name: data?.subject_name ?? subjectName,
        class_name: data?.class_name ?? null,
        section_name: data?.section_name ?? null,
        academic_year: data?.academic_year ?? null,
        periods_per_week: data?.periods_per_week ?? periods,
        assignment_type: data?.assignment_type ?? null,
      },
    });

    return NextResponse.json(
      { assignment: data },
      { status: 201 }
    );
  } catch (error) {
    console.error("Teacher assignments POST error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create assignment.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const assignmentId = String(body?.id ?? "").trim();
    const subjectName = String(body?.subject_name ?? "").trim();

    if (!assignmentId) {
      return NextResponse.json(
        { error: "Assignment ID is required." },
        { status: 400 }
      );
    }

    if (!subjectName) {
      return NextResponse.json(
        { error: "Subject name is required." },
        { status: 400 }
      );
    }

    const periods = Number(body?.periods_per_week ?? 0);

    if (!Number.isInteger(periods) || periods < 0) {
      return NextResponse.json(
        { error: "Periods per week must be a valid number." },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();

    const { data, error } = await supabase
      .from("teacher_assignments")
      .update({
        subject_name: subjectName,
        class_name: String(body?.class_name ?? "").trim() || null,
        section_name: String(body?.section_name ?? "").trim() || null,
        academic_year: String(body?.academic_year ?? "").trim() || null,
        periods_per_week: periods,
        assignment_type:
          String(body?.assignment_type ?? "PRIMARY")
            .trim()
            .toUpperCase(),
        status:
          String(body?.status ?? "ACTIVE")
            .trim()
            .toUpperCase(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", assignmentId)
      .select(
        "id, teacher_id, subject_name, class_name, section_name, academic_year, periods_per_week, assignment_type, status, created_at, updated_at"
      )
      .single();

    if (error) {
      console.error("Teacher assignments PATCH error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    await logTeacherActivity({
      teacherId: String(data?.teacher_id ?? ""),
      action: "TEACHER_ASSIGNMENT_UPDATED",
      description: `Teaching assignment updated for ${subjectName}.`,
      metadata: {
        assignment_id: data?.id ?? assignmentId,
        subject_name: data?.subject_name ?? subjectName,
        class_name: data?.class_name ?? null,
        section_name: data?.section_name ?? null,
        academic_year: data?.academic_year ?? null,
        periods_per_week: data?.periods_per_week ?? periods,
        assignment_type: data?.assignment_type ?? null,
      },
    });

    return NextResponse.json(
      { assignment: data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Teacher assignments PATCH error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to update assignment.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const assignmentId = String(body?.id ?? "").trim();

    if (!assignmentId) {
      return NextResponse.json(
        { error: "Assignment ID is required." },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();

    // Load the assignment before deleting it so we can
    // record a complete activity entry.
    const { data: existingAssignment, error: fetchError } =
      await supabase
        .from("teacher_assignments")
        .select(
          "id, teacher_id, subject_name, class_name, section_name, academic_year, periods_per_week, assignment_type, status"
        )
        .eq("id", assignmentId)
        .maybeSingle();

    if (fetchError) {
      console.error(
        "Teacher assignment DELETE lookup error:",
        fetchError
      );

      return NextResponse.json(
        { error: fetchError.message },
        { status: 500 }
      );
    }

    if (!existingAssignment) {
      return NextResponse.json(
        { error: "Teaching assignment not found." },
        { status: 404 }
      );
    }

    const { error } = await supabase
      .from("teacher_assignments")
      .delete()
      .eq("id", assignmentId);

    if (error) {
      console.error("Teacher assignments DELETE error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    await logTeacherActivity({
      teacherId: String(existingAssignment.teacher_id),
      action: "TEACHER_ASSIGNMENT_DELETED",
      description: `Teaching assignment deleted for ${existingAssignment.subject_name}.`,
      metadata: {
        assignment_id: existingAssignment.id,
        subject_name: existingAssignment.subject_name,
        class_name: existingAssignment.class_name,
        section_name: existingAssignment.section_name,
        academic_year: existingAssignment.academic_year,
        periods_per_week: existingAssignment.periods_per_week,
        assignment_type: existingAssignment.assignment_type,
        status: existingAssignment.status,
      },
    });

    return NextResponse.json({
      success: true,
      id: assignmentId,
    });
  } catch (error) {
    console.error("Teacher assignments DELETE error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to delete assignment.",
      },
      { status: 500 }
    );
  }
}
