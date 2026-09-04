import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { logTeacherActivity } from "@/lib/teacherActivity";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Supabase server configuration is missing.");
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("Staff")
      .select(
        "id, name, role, email, createdAt, employee_id, first_name, last_name, phone, gender, designation, department, status"
      )
      .eq("id", id)
      .eq("role", "Teacher")
      .maybeSingle();

    if (error) {
      console.error("Teacher GET error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Teacher not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ teacher: data });
  } catch (error) {
    console.error("Unable to load teacher:", error);

    return NextResponse.json(
      { error: "Unable to load teacher." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const supabase = getSupabaseAdmin();

    const allowedFields = [
      "name",
      "email",
      "employee_id",
      "first_name",
      "last_name",
      "phone",
      "gender",
      "designation",
      "department",
      "status",
    ] as const;

    const updates: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (
      updates.first_name !== undefined ||
      updates.last_name !== undefined ||
      updates.name === undefined
    ) {
      const firstName = String(
        updates.first_name ?? body.first_name ?? ""
      ).trim();

      const lastName = String(
        updates.last_name ?? body.last_name ?? ""
      ).trim();

      const salutation = String(
        body.salutation ?? ""
      ).trim();

      const fullName = [salutation, firstName, lastName]
        .filter(Boolean)
        .join(" ")
        .trim();

      if (fullName) {
        updates.name = fullName;
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No fields to update." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("Staff")
      .update(updates)
      .eq("id", id)
      .eq("role", "Teacher")
      .select(
        "id, name, role, email, createdAt, employee_id, first_name, last_name, phone, gender, designation, department, status"
      )
      .single();

    if (error) {
      console.error("Teacher PATCH error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    await logTeacherActivity({
      teacherId: id,
      action:
        updates.status !== undefined
          ? "TEACHER_STATUS_UPDATED"
          : "TEACHER_PROFILE_UPDATED",
      description:
        updates.status !== undefined
          ? `Teacher status changed to ${String(updates.status).toUpperCase()}.`
          : "Teacher profile updated.",
      metadata: {
        fields: Object.keys(updates),
        status: data?.status ?? null,
      },
    });

    return NextResponse.json({
      teacher: data,
      message: "Teacher updated successfully.",
    });
  } catch (error) {
    console.error("Unable to update teacher:", error);

    return NextResponse.json(
      { error: "Unable to update teacher." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("Staff")
      .delete()
      .eq("id", id)
      .eq("role", "Teacher")
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("Teacher DELETE error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Teacher not found." },
        { status: 404 }
      );
    }

    await logTeacherActivity({
      teacherId: id,
      action: "TEACHER_DELETED",
      description: "Teacher deleted from the staff directory.",
      metadata: {
        teacher_id: id,
      },
    });

    return NextResponse.json({
      message: "Teacher deleted successfully.",
      id,
    });
  } catch (error) {
    console.error("Unable to delete teacher:", error);

    return NextResponse.json(
      { error: "Unable to delete teacher." },
      { status: 500 }
    );
  }
}
