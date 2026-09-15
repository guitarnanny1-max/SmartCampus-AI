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

  return { adminClient, appUser, authUser };
}

export async function GET() {
  const authContext = await requireSuperAdmin();

  if (!authContext) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { adminClient } = authContext;

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
  const authContext = await requireSuperAdmin();

  if (!authContext) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { adminClient, appUser, authUser } = authContext;

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

  const { data: existingSubscription, error: existingSubscriptionError } =
    await adminClient
      .from("Subscription")
      .select(
        "id, tenantId, planId, status, billingCycle, currentPeriodEnd, canceledAt",
      )
      .eq("id", id)
      .maybeSingle();

  if (existingSubscriptionError) {
    console.error(
      "Platform subscription lookup error:",
      existingSubscriptionError,
    );
    return NextResponse.json(
      { error: "Failed to load subscription" },
      { status: 500 },
    );
  }

  if (!existingSubscription) {
    return NextResponse.json(
      { error: "Subscription not found" },
      { status: 404 },
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

  if (planId !== undefined) {
    const { data: currentSubscription, error: subscriptionError } =
      await adminClient
        .from("Subscription")
        .select("tenantId")
        .eq("id", id)
        .maybeSingle();

    if (subscriptionError) {
      console.error(
        "Platform subscription tenant lookup error:",
        subscriptionError,
      );

      return NextResponse.json(
        { error: "Failed to load subscription tenant" },
        { status: 500 },
      );
    }

    if (!currentSubscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 },
      );
    }

    const { data: selectedPlan, error: selectedPlanError } =
      await adminClient
        .from("PlatformPlan")
        .select("name")
        .eq("id", planId)
        .maybeSingle();

    if (selectedPlanError || !selectedPlan) {
      return NextResponse.json(
        { error: "Invalid platform plan" },
        { status: 400 },
      );
    }

    const { error: tenantUpdateError } = await adminClient
      .from("Tenant")
      .update({
        plan: selectedPlan.name,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", currentSubscription.tenantId);

    if (tenantUpdateError) {
      console.error(
        "Platform subscription tenant plan update error:",
        tenantUpdateError,
      );
      return NextResponse.json(
        { error: "Failed to synchronize tenant plan" },
        { status: 500 },
      );
    }

    const { data: tenant, error: tenantLookupError } = await adminClient
      .from("Tenant")
      .select("subdomain")
      .eq("id", currentSubscription.tenantId)
      .maybeSingle();

    if (tenantLookupError) {
      console.error(
        "Platform subscription tenant subdomain lookup error:",
        tenantLookupError,
      );
      return NextResponse.json(
        { error: "Failed to load tenant details" },
        { status: 500 },
      );
    }

    if (!tenant) {
      return NextResponse.json(
        { error: "Subscription tenant not found" },
        { status: 404 },
      );
    }

    const { error: schoolUpdateError } = await adminClient
      .from("School")
      .update({
        plan: selectedPlan.name,
      })
      .eq("subdomain", tenant.subdomain);

    if (schoolUpdateError) {
      console.error(
        "Platform subscription school plan update error:",
        schoolUpdateError,
      );
      return NextResponse.json(
        { error: "Failed to synchronize school plan" },
        { status: 500 },
      );
    }

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

  const { error: auditError } = await adminClient
    .from("PlatformAuditLog")
    .insert({
      id: `audit_${crypto.randomUUID()}`,
      actorUserId: appUser.id,
      actorEmail: authUser.email,
      action: "UPDATE_SUBSCRIPTION",
      resourceType: "Subscription",
      resourceId: data.id,
      description: `Updated subscription for tenant ${data.tenantId}.`,
      metadata: {
        subscriptionId: data.id,
        tenantId: data.tenantId,
        changes: {
          planId:
            planId !== undefined
              ? { from: existingSubscription.planId, to: data.planId }
              : undefined,
          status:
            status !== undefined
              ? { from: existingSubscription.status, to: data.status }
              : undefined,
          billingCycle:
            billingCycle !== undefined
              ? {
                  from: existingSubscription.billingCycle,
                  to: data.billingCycle,
                }
              : undefined,
          currentPeriodEnd:
            currentPeriodEnd !== undefined
              ? {
                  from: existingSubscription.currentPeriodEnd,
                  to: data.currentPeriodEnd,
                }
              : undefined,
          canceledAt:
            canceledAt !== undefined
              ? {
                  from: existingSubscription.canceledAt,
                  to: data.canceledAt,
                }
              : undefined,
        },
      },
    });

  if (auditError) {
    console.error("Platform subscription audit log error:", auditError);
  }

  return NextResponse.json({ subscription: data });
}
