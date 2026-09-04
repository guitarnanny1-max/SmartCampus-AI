import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

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

  const { data: appUser, error: userError } =
    await supabaseAdmin
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
    console.error(
      "Class subjects User lookup error:",
      userError,
    );

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

export async function GET(request: Request) {
  try {
    const context = await getAuthContext();

    if ("error" in context) {
      return context.error;
    }

    const { supabaseAdmin, tenantId } = context;

    const url = new URL(request.url);
    const classId =
      (url.searchParams.get("class_id") || "").trim();

    if (!classId) {
      return NextResponse.json(
        { error: "class_id is required." },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("class_subjects")
      .select(`
        id,
        "tenantId",
        class_id,
        subject_id,
        status,
        created_at,
        subjects (
          id,
          name,
          code,
          status
        )
      `)
      .eq("tenantId", tenantId)
      .eq("class_id", classId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(
        "Class subjects GET error:",
        error,
      );

      return NextResponse.json(
        { error: "Unable to load class subjects." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      classSubjects: data ?? [],
      total: data?.length ?? 0,
    });
  } catch (error) {
    console.error(
      "GET /api/class-subjects error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load class subjects.",
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

    const classId =
      typeof body.class_id === "string"
        ? body.class_id.trim()
        : "";

    const subjectId =
      typeof body.subject_id === "string"
        ? body.subject_id.trim()
        : "";

    if (!classId || !subjectId) {
      return NextResponse.json(
        {
          error:
            "class_id and subject_id are required.",
        },
        { status: 400 },
      );
    }

    const id =
      typeof body.id === "string" && body.id.trim()
        ? body.id.trim()
        : `class_subject_${crypto.randomUUID()}`;

    const { data, error } = await supabaseAdmin
      .from("class_subjects")
      .insert({
        id,
        tenantId,
        class_id: classId,
        subject_id: subjectId,
        status: "ACTIVE",
      })
      .select(`
        id,
        "tenantId",
        class_id,
        subject_id,
        status,
        created_at,
        subjects (
          id,
          name,
          code,
          status
        )
      `)
      .single();

    if (error) {
      console.error(
        "Class subjects POST error:",
        error,
      );

      if (error.code === "23505") {
        return NextResponse.json(
          {
            error:
              "This subject is already assigned to the class.",
          },
          { status: 409 },
        );
      }

      return NextResponse.json(
        { error: "Unable to assign subject to class." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        classSubject: data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "POST /api/class-subjects error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to assign subject to class.",
      },
      { status: 500 },
    );
  }
}
