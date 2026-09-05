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
      "Fee Structures User lookup error:",
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

export async function GET() {
  try {
    const context = await getAuthContext();

    if ("error" in context) {
      return context.error;
    }

    const { supabaseAdmin, tenantId } = context;

    const { data, error } = await supabaseAdmin
      .from("fee_structures")
      .select(`
        id,
        "tenantId",
        academic_year_id,
        class_id,
        fee_type_id,
        amount,
        frequency,
        due_date,
        description,
        status,
        created_at,
        updated_at
      `)
      .eq("tenantId", tenantId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fee Structures GET error:", error);

      return NextResponse.json(
        { error: "Unable to load fee structures." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      feeStructures: data ?? [],
      total: data?.length ?? 0,
    });
  } catch (error) {
    console.error(
      "GET /api/fee-structures error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load fee structures.",
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

    const academicYearId =
      typeof body.academic_year_id === "string"
        ? body.academic_year_id.trim()
        : "";

    const classId =
      typeof body.class_id === "string"
        ? body.class_id.trim()
        : "";

    const feeTypeId =
      typeof body.fee_type_id === "string"
        ? body.fee_type_id.trim()
        : "";

    const amountValue =
      typeof body.amount === "number"
        ? body.amount
        : typeof body.amount === "string"
          ? Number(body.amount)
          : NaN;

    const frequency =
      typeof body.frequency === "string" &&
      body.frequency.trim()
        ? body.frequency.trim().toUpperCase()
        : "ANNUAL";

    const dueDate =
      typeof body.due_date === "string" &&
      body.due_date.trim()
        ? body.due_date.trim()
        : null;

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : null;

    if (!academicYearId) {
      return NextResponse.json(
        { error: "Academic year is required." },
        { status: 400 },
      );
    }

    if (!classId) {
      return NextResponse.json(
        { error: "Class is required." },
        { status: 400 },
      );
    }

    if (!feeTypeId) {
      return NextResponse.json(
        { error: "Fee type is required." },
        { status: 400 },
      );
    }

    if (!Number.isFinite(amountValue) || amountValue < 0) {
      return NextResponse.json(
        { error: "Amount must be a non-negative number." },
        { status: 400 },
      );
    }

    if (!["ANNUAL", "TERM", "MONTHLY", "QUARTERLY", "ONE_TIME"].includes(frequency)) {
      return NextResponse.json(
        { error: "Invalid fee frequency." },
        { status: 400 },
      );
    }

    const id = `fee_structure_${crypto.randomUUID()}`;

    const { data, error } = await supabaseAdmin
      .from("fee_structures")
      .insert({
        id,
        tenantId,
        academic_year_id: academicYearId,
        class_id: classId,
        fee_type_id: feeTypeId,
        amount: amountValue,
        frequency,
        due_date: dueDate,
        description: description || null,
        status: "ACTIVE",
      })
      .select(`
        id,
        "tenantId",
        academic_year_id,
        class_id,
        fee_type_id,
        amount,
        frequency,
        due_date,
        description,
        status,
        created_at,
        updated_at
      `)
      .single();

    if (error) {
      console.error("Fee Structures POST error:", error);

      if (error.code === "23505") {
        return NextResponse.json(
          {
            error:
              "A fee structure with this academic year, class, fee type, and frequency already exists.",
          },
          { status: 409 },
        );
      }

      if (error.code === "23503") {
        return NextResponse.json(
          {
            error:
              "Academic year, class, or fee type could not be found.",
          },
          { status: 400 },
        );
      }

      return NextResponse.json(
        { error: "Unable to create fee structure." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        feeStructure: data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "POST /api/fee-structures error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create fee structure.",
      },
      { status: 500 },
    );
  }
}
