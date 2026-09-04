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
    console.error("Subjects User lookup error:", userError);
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

export async function GET() {
  try {
    const context = await getAuthContext();

    if ("error" in context) {
      return context.error;
    }

    const { supabaseAdmin, tenantId } = context;

    const { data, error } = await supabaseAdmin
      .from("subjects")
      .select(`
        id,
        "tenantId",
        name,
        code,
        status,
        created_at,
        updated_at
      `)
      .eq("tenantId", tenantId)
      .order("name", { ascending: true });

    if (error) {
      console.error("Subjects GET error:", error);
      return NextResponse.json(
        { error: "Unable to load subjects." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      subjects: data ?? [],
      total: data?.length ?? 0,
    });
  } catch (error) {
    console.error("GET /api/subjects error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load subjects.",
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

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const code =
      typeof body.code === "string"
        ? body.code.trim()
        : null;

    if (!name) {
      return NextResponse.json(
        { error: "Subject name is required." },
        { status: 400 },
      );
    }

    const id =
      typeof body.id === "string" && body.id.trim()
        ? body.id.trim()
        : `subject_${crypto.randomUUID()}`;

    const { data, error } = await supabaseAdmin
      .from("subjects")
      .insert({
        id,
        tenantId,
        name,
        code: code || null,
        status: "ACTIVE",
      })
      .select(`
        id,
        "tenantId",
        name,
        code,
        status,
        created_at,
        updated_at
      `)
      .single();

    if (error) {
      console.error("Subjects POST error:", error);

      if (error.code === "23505") {
        return NextResponse.json(
          { error: "A subject with this name already exists." },
          { status: 409 },
        );
      }

      return NextResponse.json(
        { error: "Unable to create subject." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        subject: data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/subjects error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create subject.",
      },
      { status: 500 },
    );
  }
}
