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
