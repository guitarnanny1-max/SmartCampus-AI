import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
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
      .select('id,email,"platformRole","isPlatformUser"')
      .eq("email", authUser.email)
      .maybeSingle();

    if (
      appUserError ||
      appUser?.isPlatformUser !== true ||
      appUser?.platformRole !== "SUPER_ADMIN"
    ) {
      return NextResponse.json(
        { error: "Platform Super Admin access required." },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);
    const limitParam = Number(searchParams.get("limit") || "100");
    const limit = Number.isFinite(limitParam)
      ? Math.min(Math.max(Math.floor(limitParam), 1), 500)
      : 100;

    const action = searchParams.get("action");
    const resourceType = searchParams.get("resourceType");

    let query = supabaseAdmin
      .from("PlatformAuditLog")
      .select(
        'id,"actorUserId","actorEmail",action,"resourceType","resourceId",description,metadata,"createdAt"',
      )
      .order("createdAt", { ascending: false })
      .limit(limit);

    if (action) {
      query = query.eq("action", action);
    }

    if (resourceType) {
      query = query.eq("resourceType", resourceType);
    }

    const { data: logs, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: "Failed to load audit logs." },
        { status: 500 },
      );
    }

    return NextResponse.json({ logs: logs ?? [] });
  } catch (error) {
    console.error("Platform audit logs API error:", error);

    return NextResponse.json(
      { error: "Unable to load audit logs." },
      { status: 500 },
    );
  }
}
