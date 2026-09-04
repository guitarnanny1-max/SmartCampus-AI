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
      "Class subject assignment User lookup error:",
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

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const authContext = await getAuthContext();

    if ("error" in authContext) {
      return authContext.error;
    }

    const { supabaseAdmin, tenantId } = authContext;
    const { id } = await context.params;

    let body: Record<string, unknown>;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400 },
      );
    }

    const status =
      typeof body.status === "string"
        ? body.status.trim().toUpperCase()
        : "";

    if (status !== "ACTIVE" && status !== "INACTIVE") {
      return NextResponse.json(
        {
          error: "status must be ACTIVE or INACTIVE.",
        },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("class_subjects")
      .update({ status })
      .eq("id", id)
      .eq("tenantId", tenantId)
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
      .maybeSingle();

    if (error) {
      console.error(
        "Class subject PATCH error:",
        error,
      );

      return NextResponse.json(
        { error: "Unable to update class subject." },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          error:
            "Class subject assignment not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      classSubject: data,
    });
  } catch (error) {
    console.error(
      "PATCH /api/class-subjects/[id] error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to update class subject.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext,
) {
  try {
    const authContext = await getAuthContext();

    if ("error" in authContext) {
      return authContext.error;
    }

    const { supabaseAdmin, tenantId } = authContext;
    const { id } = await context.params;

    const { data, error } = await supabaseAdmin
      .from("class_subjects")
      .update({ status: "INACTIVE" })
      .eq("id", id)
      .eq("tenantId", tenantId)
      .select("id, status")
      .maybeSingle();

    if (error) {
      console.error(
        "Class subject DELETE error:",
        error,
      );

      return NextResponse.json(
        {
          error:
            "Unable to deactivate class subject.",
        },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          error:
            "Class subject assignment not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      classSubject: data,
    });
  } catch (error) {
    console.error(
      "DELETE /api/class-subjects/[id] error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to deactivate class subject.",
      },
      { status: 500 },
    );
  }
}
