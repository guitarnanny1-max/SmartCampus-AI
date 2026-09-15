import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function requireSuperAdmin() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    supabaseUrl,
    supabasePublishableKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    },
  );

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser?.email) {
    return null;
  }

  const adminClient = createClient(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

  const { data: appUser, error } = await adminClient
    .from("User")
    .select("id, email, isPlatformUser, platformRole")
    .eq("email", authUser.email)
    .maybeSingle();

  if (
    error ||
    !appUser ||
    appUser.isPlatformUser !== true ||
    appUser.platformRole !== "SUPER_ADMIN"
  ) {
    return null;
  }

  return adminClient;
}

export async function GET() {
  const adminClient = await requireSuperAdmin();

  if (!adminClient) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await adminClient
    .from("PlatformPlan")
    .select(
      'id, name, "monthlyPrice", "annualPrice", "studentLimit", "teacherLimit", "isActive"',
    )
    .order("name");

  if (error) {
    console.error("Platform plans GET error:", error);

    return NextResponse.json(
      { error: "Failed to load platform plans" },
      { status: 500 },
    );
  }

  return NextResponse.json({ plans: data ?? [] });
}

export async function PATCH(request: Request) {
  const adminClient = await requireSuperAdmin();

  if (!adminClient) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const {
    id,
    monthlyPrice,
    annualPrice,
    studentLimit,
    teacherLimit,
    isActive,
  } = body;

  if (!id) {
    return NextResponse.json(
      { error: "Plan id is required" },
      { status: 400 },
    );
  }

  const update: Record<string, number | null | boolean> = {};

  if (monthlyPrice !== undefined) {
    update.monthlyPrice =
      monthlyPrice === "" || monthlyPrice === null
        ? null
        : Number(monthlyPrice);
  }

  if (annualPrice !== undefined) {
    update.annualPrice =
      annualPrice === "" || annualPrice === null
        ? null
        : Number(annualPrice);
  }

  if (studentLimit !== undefined) {
    update.studentLimit =
      studentLimit === "" || studentLimit === null
        ? null
        : Number(studentLimit);
  }

  if (teacherLimit !== undefined) {
    update.teacherLimit =
      teacherLimit === "" || teacherLimit === null
        ? null
        : Number(teacherLimit);
  }

  if (isActive !== undefined) {
    update.isActive = Boolean(isActive);
  }

  const numericFields = [
    "monthlyPrice",
    "annualPrice",
    "studentLimit",
    "teacherLimit",
  ] as const;

  for (const field of numericFields) {
    const value = update[field];

    if (
      value !== null &&
      value !== undefined &&
      typeof value === "number"
    ) {
      if (!Number.isFinite(value) || value < 0) {
        return NextResponse.json(
          { error: `Invalid ${field}` },
          { status: 400 },
        );
      }

      if (
        (field === "studentLimit" || field === "teacherLimit") &&
        !Number.isInteger(value)
      ) {
        return NextResponse.json(
          { error: `${field} must be a whole number` },
          { status: 400 },
        );
      }
    }
  }

  const { data, error } = await adminClient
    .from("PlatformPlan")
    .update(update)
    .eq("id", id)
    .select(
      'id, name, "monthlyPrice", "annualPrice", "studentLimit", "teacherLimit", "isActive"',
    )
    .maybeSingle();

  if (error) {
    console.error("Platform plans PATCH error:", error);

    return NextResponse.json(
      { error: "Failed to update platform plan" },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Platform plan not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ plan: data });
}
