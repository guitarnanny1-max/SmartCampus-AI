import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("Staff")
      .select(
        "id, name, salutation, role, email, createdAt, employee_id, first_name, last_name, phone, gender, designation, department, status"
      )
      .eq("role", "Teacher")
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Teachers GET error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      teachers: data ?? [],
      total: data?.length ?? 0,
    });
  } catch (error) {
    console.error("Unable to load teachers:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load teachers.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const firstName = String(body.first_name ?? "").trim();
    const lastName = String(body.last_name ?? "").trim();
    const employeeId = String(body.employee_id ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const gender = String(body.gender ?? "").trim();
    const designation =
      String(body.designation ?? "Teacher").trim() || "Teacher";
    const department = String(body.department ?? "").trim();
    const status =
      String(body.status ?? "ACTIVE").trim().toUpperCase() || "ACTIVE";

    if (!firstName) {
      return NextResponse.json(
        { error: "First name is required." },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!["ACTIVE", "INACTIVE"].includes(status)) {
      return NextResponse.json(
        { error: "Status must be ACTIVE or INACTIVE." },
        { status: 400 }
      );
    }

    const name = [firstName, lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    const supabase = getSupabaseAdmin();

    if (employeeId) {
      const { data: existingEmployee } = await supabase
        .from("Staff")
        .select("id")
        .eq("employee_id", employeeId)
        .eq("role", "Teacher")
        .maybeSingle();

      if (existingEmployee) {
        return NextResponse.json(
          { error: "A teacher with this Employee ID already exists." },
          { status: 409 }
        );
      }
    }

    const { data: existingEmail } = await supabase
      .from("Staff")
      .select("id")
      .eq("email", email)
      .eq("role", "Teacher")
      .maybeSingle();

    if (existingEmail) {
      return NextResponse.json(
        { error: "A teacher with this email already exists." },
        { status: 409 }
      );
    }

    const id =
      employeeId ||
      `TCH-${Date.now().toString(36).toUpperCase()}`;

    const { data, error } = await supabase
      .from("Staff")
      .insert({
        id,
        name,
        role: "Teacher",
        email,
        employee_id: employeeId || null,
        first_name: firstName,
        last_name: lastName || null,
        phone: phone || null,
        gender: gender || null,
        designation,
        department: department || null,
        status,
      })
      .select(
        "id, name, salutation, role, email, createdAt, employee_id, first_name, last_name, phone, gender, designation, department, status"
      )
      .single();

    if (error) {
      console.error("Teachers POST error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        teacher: data,
        message: "Teacher created successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unable to create teacher:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create teacher.",
      },
      { status: 500 }
    );
  }
}
