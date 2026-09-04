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

    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !publishableKey || !serviceRoleKey) {
      return NextResponse.json(
        {
          error: "Supabase environment is not fully configured.",
        },
        { status: 500 },
      );
    }

    /*
     * ============================================================
     * 1. VERIFY THE AUTHENTICATED SUPABASE SESSION
     * ============================================================
     */

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
              cookiesToSet.forEach(
                ({ name, value, options }) => {
                  cookieStore.set(name, value, options);
                },
              );
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

    if (authError || !authUser) {
      return NextResponse.json(
        {
          authenticated: false,
          user: null,
          tenant: null,
        },
        { status: 401 },
      );
    }

    /*
     * ============================================================
     * 2. SERVER-ONLY DATABASE CLIENT
     * ============================================================
     *
     * Used only after Auth has verified the user.
     *
     * NEVER expose this key to the browser.
     */

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

    /*
     * ============================================================
     * 3. LOAD APPLICATION USER
     * ============================================================
     */

    const { data: appUser, error: appUserError } =
      await supabaseAdmin
        .from("User")
        .select(
          `
            id,
            "tenantId",
            email,
            name,
            role
          `,
        )
        .eq("email", authUser.email)
        .maybeSingle();

    if (appUserError) {
      console.error(
        "Application user lookup error:",
        appUserError,
      );

      return NextResponse.json(
        {
          authenticated: true,

          authUser: {
            id: authUser.id,
            email: authUser.email,
          },

          error: "Unable to load application user.",
          details:
            process.env.NODE_ENV === "development"
              ? appUserError.message
              : undefined,
        },
        { status: 500 },
      );
    }

    if (!appUser) {
      return NextResponse.json(
        {
          authenticated: true,

          authUser: {
            id: authUser.id,
            email: authUser.email,
          },

          user: null,
          tenant: null,

          error:
            "Authenticated user has no application User record.",
        },
        { status: 403 },
      );
    }

    /*
     * ============================================================
     * 4. LOAD TENANT
     * ============================================================
     */

    const { data: tenant, error: tenantError } =
      await supabaseAdmin
        .from("Tenant")
        .select(
          `
            id,
            subdomain,
            name,
            plan,
            status,
            "paymentStatus",
            "onboardingStatus"
          `,
        )
        .eq("id", appUser.tenantId)
        .maybeSingle();

    if (tenantError) {
      console.error(
        "Tenant lookup error:",
        tenantError,
      );

      return NextResponse.json(
        {
          authenticated: true,
          authUser: {
            id: authUser.id,
            email: authUser.email,
          },
          user: appUser,
          tenant: null,
          error: "Unable to load tenant.",
          details:
            process.env.NODE_ENV === "development"
              ? tenantError.message
              : undefined,
        },
        { status: 500 },
      );
    }

    /*
     * ============================================================
     * 5. RETURN TENANT-AWARE SESSION
     * ============================================================
     */

    return NextResponse.json({
      authenticated: true,

      authUser: {
        id: authUser.id,
        email: authUser.email,
        emailConfirmed:
          !!authUser.email_confirmed_at,
      },

      user: appUser,

      tenant,
    });
  } catch (error) {
    console.error("Auth /me error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Authentication lookup failed.",
      },
      { status: 500 },
    );
  }
}
