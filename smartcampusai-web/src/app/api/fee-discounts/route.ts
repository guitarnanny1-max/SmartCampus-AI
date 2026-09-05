import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

async function getAdminContext() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    }
  );

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user?.email) {
    return {
      error: NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  const { data: appUser, error: appUserError } = await admin
    .from("User")
    .select('id, "tenantId", email, name, role')
    .eq("email", user.email)
    .maybeSingle();

  if (appUserError || !appUser) {
    return {
      error: NextResponse.json(
        { success: false, error: "Application user not found" },
        { status: 403 }
      ),
    };
  }

  return { admin, appUser };
}

export async function GET(request: NextRequest) {
  try {
    const context = await getAdminContext();

    if ("error" in context) {
      return context.error;
    }

    const { admin, appUser } = context;
    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status");

    let query = admin
      .from("fee_discounts")
      .select("*")
      .eq('"tenantId"', appUser.tenantId)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      discounts: data || [],
      total: data?.length || 0,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unexpected error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await getAdminContext();

    if ("error" in context) {
      return context.error;
    }

    const { admin, appUser } = context;
    const body = await request.json();

    const name = String(body.name || "").trim();
    const code = body.code ? String(body.code).trim() : null;
    const discountType = String(
      body.discount_type || "FIXED"
    ).toUpperCase();
    const value = Number(body.value);
    const description = body.description
      ? String(body.description).trim()
      : null;
    const status = String(body.status || "ACTIVE").toUpperCase();

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Discount name is required" },
        { status: 400 }
      );
    }

    if (!["FIXED", "PERCENTAGE"].includes(discountType)) {
      return NextResponse.json(
        {
          success: false,
          error: "Discount type must be FIXED or PERCENTAGE",
        },
        { status: 400 }
      );
    }

    if (!Number.isFinite(value) || value < 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Discount value must be a non-negative number",
        },
        { status: 400 }
      );
    }

    if (discountType === "PERCENTAGE" && value > 100) {
      return NextResponse.json(
        {
          success: false,
          error: "Percentage discount cannot exceed 100",
        },
        { status: 400 }
      );
    }

    if (!["ACTIVE", "INACTIVE"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: "Status must be ACTIVE or INACTIVE",
        },
        { status: 400 }
      );
    }

    const { data: existing } = await admin
      .from("fee_discounts")
      .select("id")
      .eq('"tenantId"', appUser.tenantId)
      .eq("name", name)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: "A discount with this name already exists",
        },
        { status: 409 }
      );
    }

    const id = `fee_discount_${crypto.randomUUID()}`;

    const { data, error } = await admin
      .from("fee_discounts")
      .insert({
        id,
        tenantId: appUser.tenantId,
        name,
        code,
        discount_type: discountType,
        value,
        description,
        status,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        discount: data,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unexpected error",
      },
      { status: 500 }
    );
  }
}
