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
        { error: "Supabase configuration is incomplete." },
        { status: 500 },
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
            // Cookies may be read-only in this request context.
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
      .select("id, tenantId, email, name, role")
      .eq("email", authUser.email)
      .maybeSingle();

  if (userError) {
    console.error("Academic year User lookup error:", userError);

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

/*
 * ============================================================
 * GET — LIST ACADEMIC YEARS
 * ============================================================
 */
export async function GET() {
  try {
    const context = await getAuthContext();

    if ("error" in context) {
      return context.error;
    }

    const { supabaseAdmin, tenantId } = context;

    const { data, error } = await supabaseAdmin
      .from("academic_years")
      .select(
        `
          id,
          "tenantId",
          name,
          start_date,
          end_date,
          status,
          created_at,
          updated_at
        `,
      )
      .eq("tenantId", tenantId)
      .order("start_date", { ascending: false })
      .order("name", { ascending: false });

    if (error) {
      console.error("Academic years GET error:", error);

      return NextResponse.json(
        {
          error: "Unable to load academic years.",
          details:
            process.env.NODE_ENV === "development"
              ? {
                  message: error.message,
                  code: error.code,
                  details: error.details,
                  hint: error.hint,
                }
              : undefined,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      academicYears: data ?? [],
      total: data?.length ?? 0,
    });
  } catch (error) {
    console.error("GET /api/academic-years error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load academic years.",
      },
      { status: 500 },
    );
  }
}

/*
 * ============================================================
 * POST — CREATE ACADEMIC YEAR
 * ============================================================
 */
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

    const startDate =
      typeof body.start_date === "string" &&
      body.start_date.trim()
        ? body.start_date.trim()
        : null;

    const endDate =
      typeof body.end_date === "string" &&
      body.end_date.trim()
        ? body.end_date.trim()
        : null;

    if (!name) {
      return NextResponse.json(
        { error: "Academic year name is required." },
        { status: 400 },
      );
    }

    if (startDate && endDate && startDate > endDate) {
      return NextResponse.json(
        { error: "Start date cannot be after end date." },
        { status: 400 },
      );
    }

    const id =
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const { data, error } = await supabaseAdmin
      .from("academic_years")
      .insert({
        id,
        tenantId,
        name,
        start_date: startDate,
        end_date: endDate,
        status: "ACTIVE",
      })
      .select(
        `
          id,
          "tenantId",
          name,
          start_date,
          end_date,
          status,
          created_at,
          updated_at
        `,
      )
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          {
            error:
              "An academic year with this name already exists.",
          },
          { status: 409 },
        );
      }

      console.error("Academic year POST error:", error);

      return NextResponse.json(
        {
          error: "Unable to create academic year.",
          details:
            process.env.NODE_ENV === "development"
              ? {
                  message: error.message,
                  code: error.code,
                  details: error.details,
                  hint: error.hint,
                }
              : undefined,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        academicYear: data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/academic-years error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create academic year.",
      },
      { status: 500 },
    );
  }
}
