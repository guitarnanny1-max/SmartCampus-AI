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
            // Read-only request context.
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
    console.error("Classes User lookup error:", userError);

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
 * GET — LIST CLASSES
 * ============================================================
 */
export async function GET(request: Request) {
  try {
    const context = await getAuthContext();

    if ("error" in context) {
      return context.error;
    }

    const { supabaseAdmin, tenantId } = context;
    const url = new URL(request.url);

    const academicYearId =
      (url.searchParams.get("academic_year_id") || "").trim();

    let query = supabaseAdmin
      .from("classes")
      .select(
        `
          id,
          "tenantId",
          academic_year_id,
          name,
          display_order,
          status,
          created_at,
          updated_at
        `,
      )
      .eq("tenantId", tenantId)
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

    if (academicYearId) {
      query = query.eq(
        "academic_year_id",
        academicYearId,
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Classes GET error:", error);

      return NextResponse.json(
        { error: "Unable to load classes." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      classes: data ?? [],
      total: data?.length ?? 0,
    });
  } catch (error) {
    console.error("GET /api/classes error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load classes.",
      },
      { status: 500 },
    );
  }
}

/*
 * ============================================================
 * POST — CREATE CLASS
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

    const academicYearId =
      typeof body.academic_year_id === "string"
        ? body.academic_year_id.trim()
        : "";

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const displayOrder =
      typeof body.display_order === "number" &&
      Number.isInteger(body.display_order)
        ? body.display_order
        : 0;

    if (!academicYearId) {
      return NextResponse.json(
        { error: "Academic year is required." },
        { status: 400 },
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: "Class name is required." },
        { status: 400 },
      );
    }

    /*
     * Verify that the academic year belongs to
     * the current tenant.
     */
    const { data: academicYear, error: yearError } =
      await supabaseAdmin
        .from("academic_years")
        .select("id")
        .eq("id", academicYearId)
        .eq("tenantId", tenantId)
        .maybeSingle();

    if (yearError) {
      console.error(
        "Class academic year lookup error:",
        yearError,
      );

      return NextResponse.json(
        { error: "Unable to validate academic year." },
        { status: 500 },
      );
    }

    if (!academicYear) {
      return NextResponse.json(
        { error: "Academic year not found." },
        { status: 404 },
      );
    }

    const id =
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const { data, error } = await supabaseAdmin
      .from("classes")
      .insert({
        id,
        tenantId,
        academic_year_id: academicYearId,
        name,
        display_order: displayOrder,
        status: "ACTIVE",
      })
      .select(
        `
          id,
          "tenantId",
          academic_year_id,
          name,
          display_order,
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
              "A class with this name already exists for this academic year.",
          },
          { status: 409 },
        );
      }

      console.error("Class POST error:", error);

      return NextResponse.json(
        { error: "Unable to create class." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        class: data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/classes error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create class.",
      },
      { status: 500 },
    );
  }
}
