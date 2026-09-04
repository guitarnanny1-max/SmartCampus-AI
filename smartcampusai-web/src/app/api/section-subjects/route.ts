import { NextResponse } from "next/server";
import crypto from "crypto";
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
      "Section subjects User lookup error:",
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

    const sectionId =
      (url.searchParams.get("section_id") || "").trim();

    if (!sectionId) {
      return NextResponse.json(
        { error: "section_id is required." },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("section_subjects")
      .select(`
        id,
        "tenantId",
        class_id,
        section_id,
        subject_id,
        status,
        created_at,
        updated_at,
        subjects (
          id,
          name,
          code,
          status
        )
      `)
      .eq("tenantId", tenantId)
      .eq("section_id", sectionId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(
        "Section subjects GET error:",
        error,
      );

      return NextResponse.json(
        {
          error: "Unable to load section subjects.",
          details: error.message,
          code: error.code,
          hint: error.hint,
          detailsFromSupabase: error.details,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      sectionSubjects: data ?? [],
      total: data?.length ?? 0,
    });
  } catch (error) {
    console.error(
      "GET /api/section-subjects error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load section subjects.",
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

    const sectionId =
      typeof body.section_id === "string"
        ? body.section_id.trim()
        : "";

    const classId =
      typeof body.class_id === "string"
        ? body.class_id.trim()
        : "";

    const subjectId =
      typeof body.subject_id === "string"
        ? body.subject_id.trim()
        : "";

    if (!sectionId || !classId || !subjectId) {
      return NextResponse.json(
        {
          error:
            "section_id, class_id and subject_id are required.",
        },
        { status: 400 },
      );
    }

    const id =
      `section_subject_${crypto.randomUUID()}`;

    const { data, error } = await supabaseAdmin
      .from("section_subjects")
      .insert({
        id,
        tenantId,
        class_id: classId,
        section_id: sectionId,
        subject_id: subjectId,
        status: "ACTIVE",
      })
      .select(`
        id,
        "tenantId",
        class_id,
        section_id,
        subject_id,
        status,
        created_at,
        updated_at,
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
        "Section subjects POST error:",
        error,
      );

      if (error.code === "23505") {
        return NextResponse.json(
          {
            error:
              "This subject is already assigned to the section.",
          },
          { status: 409 },
        );
      }

      return NextResponse.json(
        { error: "Unable to assign subject to section." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        sectionSubject: data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "POST /api/section-subjects error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to assign subject to section.",
      },
      { status: 500 },
    );
  }
}
