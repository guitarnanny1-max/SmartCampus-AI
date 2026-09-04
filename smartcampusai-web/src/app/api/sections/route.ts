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
    console.error("Sections User lookup error:", userError);

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
 * GET — LIST SECTIONS
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

    const classId =
      (url.searchParams.get("class_id") || "").trim();

    let query = supabaseAdmin
      .from("sections")
      .select(
        `
          id,
          "tenantId",
          class_id,
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

    if (classId) {
      query = query.eq("class_id", classId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Sections GET error:", error);

      return NextResponse.json(
        { error: "Unable to load sections." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      sections: data ?? [],
      total: data?.length ?? 0,
    });
  } catch (error) {
    console.error("GET /api/sections error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load sections.",
      },
      { status: 500 },
    );
  }
}

/*
 * ============================================================
 * POST — CREATE SECTION
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

    const classId =
      typeof body.class_id === "string"
        ? body.class_id.trim()
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

    if (!classId) {
      return NextResponse.json(
        { error: "Class is required." },
        { status: 400 },
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: "Section name is required." },
        { status: 400 },
      );
    }

    /*
     * Verify that the class belongs to the current tenant.
     */
    const { data: classRecord, error: classError } =
      await supabaseAdmin
        .from("classes")
        .select("id, academic_year_id")
        .eq("id", classId)
        .eq("tenantId", tenantId)
        .maybeSingle();

    if (classError) {
      console.error(
        "Section class lookup error:",
        classError,
      );

      return NextResponse.json(
        { error: "Unable to validate class." },
        { status: 500 },
      );
    }

    if (!classRecord) {
      return NextResponse.json(
        { error: "Class not found." },
        { status: 404 },
      );
    }

    const id =
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const { data, error } = await supabaseAdmin
      .from("sections")
      .insert({
        id,
        tenantId,
        class_id: classId,
        name,
        display_order: displayOrder,
        status: "ACTIVE",
      })
      .select(
        `
          id,
          "tenantId",
          class_id,
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
              "A section with this name already exists for this class.",
          },
          { status: 409 },
        );
      }

      console.error("Section POST error:", error);

      return NextResponse.json(
        { error: "Unable to create section." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        section: data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/sections error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create section.",
      },
      { status: 500 },
    );
  }
}
