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
    .from("Subscription")
    .select(
      `
        id,
        tenantId,
        planId,
        status,
        billingCycle,
        startedAt,
        currentPeriodStart,
        currentPeriodEnd,
        canceledAt,
        createdAt,
        updatedAt,
        Tenant:tenantId (
          id,
          name,
          subdomain,
          plan,
          status,
          paymentStatus,
          onboardingStatus
        ),
        PlatformPlan:planId (
          id,
          name,
          monthlyPrice,
          annualPrice
        )
      `,
    )
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Platform subscriptions GET error:", error);

    return NextResponse.json(
      { error: "Failed to load subscriptions" },
      { status: 500 },
    );
  }

  return NextResponse.json({ subscriptions: data ?? [] });
}

export async function PATCH(request: Request) {
  const adminClient = await requireSuperAdmin();

  if (!adminClient) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const {
    id,
    planId,
    status,
    billingCycle,
    currentPeriodEnd,
    canceledAt,
  } = body;

  if (!id) {
    return NextResponse.json(
      { error: "Subscription id is required" },
      { status: 400 },
    );
  }

  const update: Record<string, string | null> = {};

  if (planId !== undefined) {
    const { data: plan, error: planError } = await adminClient
      .from("PlatformPlan")
      .select("id")
      .eq("id", planId)
      .maybeSingle();

    if (planError) {
      console.error("Platform subscription plan lookup error:", planError);

      return NextResponse.json(
        { error: "Failed to validate plan" },
        { status: 500 },
      );
    }

    if (!plan) {
      return NextResponse.json(
        { error: "Invalid platform plan" },
        { status: 400 },
      );
    }

    update.planId = planId;
  }

  if (status !== undefined) {
    if (
      !["TRIALING", "ACTIVE", "PAST_DUE", "CANCELED", "EXPIRED"].includes(
        status,
      )
    ) {
      return NextResponse.json(
        { error: "Invalid subscription status" },
        { status: 400 },
      );
    }

    update.status = status;
  }

  if (billingCycle !== undefined) {
    if (!["MONTHLY", "ANNUAL"].includes(billingCycle)) {
      return NextResponse.json(
        { error: "Invalid billing cycle" },
        { status: 400 },
      );
    }

    update.billingCycle = billingCycle;
  }

  if (currentPeriodEnd !== undefined) {
    update.currentPeriodEnd = currentPeriodEnd || null;
  }

  if (canceledAt !== undefined) {
    update.canceledAt = canceledAt || null;
  }

  update.updatedAt = new Date().toISOString();

  const { data, error } = await adminClient
    .from("Subscription")
    .update(update)
    .eq("id", id)
    .select(
      `
        id,
        tenantId,
        planId,
        status,
        billingCycle,
        startedAt,
        currentPeriodStart,
        currentPeriodEnd,
        canceledAt,
        createdAt,
        updatedAt,
        Tenant:tenantId (
          id,
          name,
          subdomain,
          plan,
          status,
          paymentStatus,
          onboardingStatus
        ),
        PlatformPlan:planId (
          id,
          name,
          monthlyPrice,
          annualPrice
        )
      `,
    )
    .maybeSingle();

  if (error) {
    console.error("Platform subscriptions PATCH error:", error);

    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Subscription not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ subscription: data });
}
