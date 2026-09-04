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
    console.error("Student 360 guardian User lookup error:", userError);
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

    const { data: student, error: studentError } = await supabaseAdmin
      .from("Student")
      .select("id")
      .eq("id", id)
      .eq("tenantId", tenantId)
      .maybeSingle();

    if (studentError) {
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

    const { data: guardians, error } = await supabaseAdmin
      .from("student_guardians")
      .select(`
        id,
        "tenantId",
        student_id,
        name,
        relationship,
        email,
        phone,
        is_primary,
        is_emergency_contact,
        created_at,
        updated_at
      `)
      .eq("tenantId", tenantId)
      .eq("student_id", id)
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Student 360 guardian load error:", error);
      return NextResponse.json(
        { error: "Unable to load guardians." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      guardians: guardians ?? [],
    });
  } catch (error) {
    console.error("GET /api/students/[id]/guardians error:", error);

    return NextResponse.json(
      { error: "Unable to load guardians." },
      { status: 500 },
    );
  }
}

export async function POST(
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
    const body = await request.json();

    const { data: student, error: studentError } = await supabaseAdmin
      .from("Student")
      .select("id")
      .eq("id", id)
      .eq("tenantId", tenantId)
      .maybeSingle();

    if (studentError) {
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

    const name = String(body.name || "").trim();

    if (!name) {
      return NextResponse.json(
        { error: "Guardian name is required." },
        { status: 400 },
      );
    }

    const isPrimary = Boolean(body.is_primary);
    const isEmergencyContact = Boolean(body.is_emergency_contact);

    if (isPrimary) {
      await supabaseAdmin
        .from("student_guardians")
        .update({
          is_primary: false,
          updated_at: new Date().toISOString(),
        })
        .eq("tenantId", tenantId)
        .eq("student_id", id);
    }

    const { data: guardian, error } = await supabaseAdmin
      .from("student_guardians")
      .insert({
        id: `guardian_${crypto.randomUUID()}`,
        tenantId,
        student_id: id,
        name,
        relationship: body.relationship || null,
        email: body.email || null,
        phone: body.phone || null,
        is_primary: isPrimary,
        is_emergency_contact: isEmergencyContact,
      })
      .select()
      .single();

    if (error) {
      console.error("Student 360 guardian creation error:", error);
      return NextResponse.json(
        { error: "Unable to create guardian." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        guardian,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/students/[id]/guardians error:", error);

    return NextResponse.json(
      { error: "Unable to create guardian." },
      { status: 500 },
    );
  }
}
