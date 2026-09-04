import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

async function getAuthContext() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !publishableKey || !serviceRoleKey) {
    throw new Error("Supabase environment is not fully configured.");
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
    console.error("Student 360 profile User lookup error:", userError);
    return {
      error: NextResponse.json(
        { error: "Unable to load application user." },
        { status: 500 },
      ),
    };
  }

  if (!appUser) {
    return {
      error: NextResponse.json(
        {
          error:
            "Authenticated user has no application User record.",
        },
        { status: 403 },
      ),
    };
  }

  if (!appUser.tenantId) {
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

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const authContext = await getAuthContext();

    if ("error" in authContext) {
      return authContext.error;
    }

    const { supabaseAdmin, tenantId } = authContext;
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Student ID is required." },
        { status: 400 },
      );
    }

    const { data: student, error: studentError } = await supabaseAdmin
      .from("Student")
      .select("id, name")
      .eq("id", id)
      .eq("tenantId", tenantId)
      .maybeSingle();

    if (studentError) {
      console.error("Student 360 profile student lookup error:", studentError);
      return NextResponse.json(
        { error: "Unable to verify student." },
        { status: 500 },
      );
    }

    if (!student) {
      return NextResponse.json(
        { error: "Student not found." },
        { status: 404 },
      );
    }

    const { data: profile, error } = await supabaseAdmin
      .from("student_profiles")
      .select(`
        id,
        "tenantId",
        student_id,
        first_name,
        middle_name,
        last_name,
        date_of_birth,
        gender,
        address_line1,
        address_line2,
        city,
        state,
        country,
        postal_code,
        created_at,
        updated_at
      `)
      .eq("tenantId", tenantId)
      .eq("student_id", id)
      .maybeSingle();

    if (error) {
      console.error("Student 360 profile load error:", error);
      return NextResponse.json(
        { error: "Unable to load student profile." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      profile: profile ?? null,
    });
  } catch (error) {
    console.error("GET /api/students/[id]/profile error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load student profile.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const authContext = await getAuthContext();

    if ("error" in authContext) {
      return authContext.error;
    }

    const { supabaseAdmin, tenantId } = authContext;
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Student ID is required." },
        { status: 400 },
      );
    }

    const { data: student, error: studentError } = await supabaseAdmin
      .from("Student")
      .select("id, name")
      .eq("id", id)
      .eq("tenantId", tenantId)
      .maybeSingle();

    if (studentError) {
      console.error("Student 360 profile student lookup error:", studentError);
      return NextResponse.json(
        { error: "Unable to verify student." },
        { status: 500 },
      );
    }

    if (!student) {
      return NextResponse.json(
        { error: "Student not found." },
        { status: 404 },
      );
    }

    const body = await request.json();

    const allowedFields = [
      "first_name",
      "middle_name",
      "last_name",
      "date_of_birth",
      "gender",
      "address_line1",
      "address_line2",
      "city",
      "state",
      "country",
      "postal_code",
    ] as const;

    const updates: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(body, field)) {
        updates[field] = body[field] === "" ? null : body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No profile fields were supplied." },
        { status: 400 },
      );
    }

    updates.updated_at = new Date().toISOString();

    const { data: existingProfile } = await supabaseAdmin
      .from("student_profiles")
      .select("id")
      .eq("tenantId", tenantId)
      .eq("student_id", id)
      .maybeSingle();

    let profile;
    let error;

    if (existingProfile) {
      const result = await supabaseAdmin
        .from("student_profiles")
        .update(updates)
        .eq("id", existingProfile.id)
        .eq("tenantId", tenantId)
        .select()
        .single();

      profile = result.data;
      error = result.error;
    } else {
      const result = await supabaseAdmin
        .from("student_profiles")
        .insert({
          id: `profile_${crypto.randomUUID()}`,
          tenantId,
          student_id: id,
          ...updates,
        })
        .select()
        .single();

      profile = result.data;
      error = result.error;
    }

    if (error) {
      console.error("Student 360 profile save error:", error);
      return NextResponse.json(
        { error: "Unable to save student profile." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("PATCH /api/students/[id]/profile error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to save student profile.",
      },
      { status: 500 },
    );
  }
}
