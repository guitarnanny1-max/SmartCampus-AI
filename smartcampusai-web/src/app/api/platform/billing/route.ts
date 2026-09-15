import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

async function requireSuperAdmin(request: NextRequest) {

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {},
      },
    }
  );

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser?.email) {
    return null;
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

  const { data: appUser } = await admin
    .from("User")
    .select("id,email,isPlatformUser,platformRole")
    .eq("email", authUser.email)
    .maybeSingle();

  if (
    !appUser ||
    appUser.isPlatformUser !== true ||
    appUser.platformRole !== "SUPER_ADMIN"
  ) {
    return null;
  }

  return admin;
}

export async function GET(request: NextRequest) {
  const admin = await requireSuperAdmin(request);

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: subscriptions, error } = await admin
    .from("Subscription")
    .select(
      `
        id,
        tenantId,
        status,
        billingCycle,
        startedAt,
        currentPeriodStart,
        currentPeriodEnd,
        Tenant (
          id,
          name,
          subdomain,
          plan
        ),
        PlatformPlan (
          id,
          name,
          monthlyPrice,
          annualPrice
        )
      `
    )
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Billing subscriptions query failed:", error);
    return NextResponse.json(
      { error: "Failed to load billing data" },
      { status: 500 }
    );
  }

  const activeSubscriptions = (subscriptions ?? []).filter(
    (subscription) =>
      subscription.status === "ACTIVE" ||
      subscription.status === "TRIALING"
  );

  let mrr = 0;
  let arr = 0;

  for (const subscription of activeSubscriptions) {
    const plan = Array.isArray(subscription.PlatformPlan)
      ? subscription.PlatformPlan[0]
      : subscription.PlatformPlan;

    if (!plan) {
      continue;
    }

    const monthlyPrice = Number(plan.monthlyPrice ?? 0);
    const annualPrice = Number(plan.annualPrice ?? 0);

    if (subscription.billingCycle === "ANNUAL") {
      arr += annualPrice;
      mrr += annualPrice / 12;
    } else {
      mrr += monthlyPrice;
      arr += monthlyPrice * 12;
    }
  }

  return NextResponse.json({
    summary: {
      mrr,
      arr,
      activeSubscriptions: activeSubscriptions.length,
      totalSubscriptions: subscriptions?.length ?? 0,
    },
    subscriptions: subscriptions ?? [],
  });
}
