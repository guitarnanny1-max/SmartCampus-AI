import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const publishableKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !publishableKey || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Supabase environment is not fully configured." },
        { status: 500 },
      );
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
              // Safe to ignore when cookies are read-only.
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
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
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

    const { data: appUser, error: appUserError } = await supabaseAdmin
      .from("User")
      .select('id, email, "platformRole", "isPlatformUser"')
      .eq("email", authUser.email)
      .maybeSingle();

    if (appUserError) {
      console.error("Platform user lookup error:", appUserError);
      return NextResponse.json(
        { error: "Unable to verify platform access." },
        { status: 500 },
      );
    }

    if (
      appUser?.isPlatformUser !== true ||
      appUser?.platformRole !== "SUPER_ADMIN"
    ) {
      return NextResponse.json(
        { error: "Platform Super Admin access required." },
        { status: 403 },
      );
    }

    const { data: schools, error: schoolError } = await supabaseAdmin
      .from("School")
      .select("id, name, subdomain, plan")
      .order("name", { ascending: true });

    if (schoolError) {
      console.error("Platform schools query error:", schoolError);
      return NextResponse.json(
        { error: "Unable to load schools." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      schools: schools ?? [],
      total: schools?.length ?? 0,
    });
  } catch (error) {
    console.error("Platform schools API error:", error);

    return NextResponse.json(
      { error: "Unable to load platform schools." },
      { status: 500 },
    );
  }
}


function cleanString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.trim();
  return cleaned || null;
}

function createId(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`;
}

function makeSubdomainBase(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const publishableKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !publishableKey || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Supabase environment is not fully configured." },
        { status: 500 },
      );
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
              // Safe to ignore when cookies are read-only.
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
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
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

    const { data: appUser, error: appUserError } = await supabaseAdmin
      .from("User")
      .select('id, email, "platformRole", "isPlatformUser"')
      .eq("email", authUser.email)
      .maybeSingle();

    if (appUserError) {
      console.error("Platform user lookup error:", appUserError);
      return NextResponse.json(
        { error: "Unable to verify platform access." },
        { status: 500 },
      );
    }

    if (
      appUser?.isPlatformUser !== true ||
      appUser?.platformRole !== "SUPER_ADMIN"
    ) {
      return NextResponse.json(
        { error: "Platform Super Admin access required." },
        { status: 403 },
      );
    }

    const body = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;

    const name = cleanString(body.name);
    const email = cleanString(body.adminEmail)?.toLowerCase();
    const adminName =
      cleanString(body.adminName) || "School Administrator";
    const requestedPlan =
      cleanString(body.plan)?.toUpperCase() || "STARTER";

    if (!name) {
      return NextResponse.json(
        { error: "School name is required." },
        { status: 400 },
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "Administrator email is required." },
        { status: 400 },
      );
    }

    const subdomainInput = cleanString(body.subdomain);
    const subdomainBase =
      subdomainInput ||
      makeSubdomainBase(name);

    const subdomain = subdomainBase.toLowerCase();

    const { data: existingSchool } = await supabaseAdmin
      .from("School")
      .select("id, name, subdomain, plan")
      .or(`name.eq.${name},subdomain.eq.${subdomain}`)
      .maybeSingle();

    if (existingSchool) {
      return NextResponse.json(
        {
          error:
            "A school with this name or subdomain already exists.",
          school: existingSchool,
        },
        { status: 409 },
      );
    }

    const { data: existingTenant } = await supabaseAdmin
      .from("Tenant")
      .select("id, name, subdomain, plan")
      .eq("subdomain", subdomain)
      .maybeSingle();

    if (existingTenant) {
      return NextResponse.json(
        {
          error: "This subdomain is already in use.",
          tenant: existingTenant,
        },
        { status: 409 },
      );
    }

    const tenantId = createId("tenant");
    const schoolId = createId("school");
    const userId = createId("user");
    const now = new Date().toISOString();

    const { data: tenant, error: tenantError } = await supabaseAdmin
      .from("Tenant")
      .insert({
        id: tenantId,
        subdomain,
        name,
        plan: requestedPlan,
        createdAt: now,
        updatedAt: now,
      })
      .select()
      .single();

    if (tenantError) {
      console.error("Platform tenant creation error:", tenantError);
      return NextResponse.json(
        { error: "Unable to create school tenant." },
        { status: 500 },
      );
    }

    const { data: school, error: schoolError } = await supabaseAdmin
      .from("School")
      .insert({
        id: schoolId,
        name,
        subdomain,
        plan: requestedPlan,
      })
      .select()
      .single();

    if (schoolError) {
      console.error("Platform school creation error:", schoolError);
      await supabaseAdmin.from("Tenant").delete().eq("id", tenantId);

      return NextResponse.json(
        { error: "Unable to create school." },
        { status: 500 },
      );
    }

    const { data: admin, error: adminError } = await supabaseAdmin
      .from("User")
      .insert({
        id: userId,
        tenantId,
        email,
        name: adminName,
        role: "SCHOOL_ADMIN",
        password: "PENDING_AUTH_SETUP",
      })
      .select("id, tenantId, email, name, role, createdAt")
      .single();

    if (adminError) {
      console.error(
        "Platform school administrator creation error:",
        adminError,
      );

      await supabaseAdmin.from("School").delete().eq("id", schoolId);
      await supabaseAdmin.from("Tenant").delete().eq("id", tenantId);

      return NextResponse.json(
        { error: "Unable to create school administrator." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "School created successfully.",
        onboarding: {
          status: "PENDING_AUTH_SETUP",
          tenantId,
          schoolId,
          subdomain,
          plan: requestedPlan,
        },
        admin,
        school,
        tenant,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Platform school creation API error:", error);

    return NextResponse.json(
      {
        error: "Unable to create school.",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
      },
      { status: 500 },
    );
  }
}
