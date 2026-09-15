import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return response;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isWorkspaceRoute =
    pathname.startsWith("/app") || pathname.startsWith("/operations");

  /*
   * MAINTENANCE MODE
   *
   * Platform Control Center remains accessible so SUPER_ADMIN can
   * disable maintenance mode.
   */
  if (isWorkspaceRoute && user) {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (serviceRoleKey) {
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

      const { data: platformSettings } = await supabaseAdmin
        .from("PlatformSettings")
        .select("maintenanceMode")
        .eq("id", "platform_settings")
        .maybeSingle();

      if (platformSettings?.maintenanceMode === true) {
        const maintenanceUrl = request.nextUrl.clone();
        maintenanceUrl.pathname = "/maintenance";
        maintenanceUrl.search = "";
        return NextResponse.redirect(maintenanceUrl);
      }
    }
  }

  /*
   * SCHOOL WORKSPACE
   */
  if (pathname.startsWith("/app") && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  /*
   * PLATFORM CONTROL CENTER
   */
  if (pathname.startsWith("/platform") && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  /*
   * THOMASG TECHNOLOGIES OPERATIONS
   */
  if (pathname.startsWith("/operations") && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  /*
   * AUTHENTICATED USERS SHOULD NOT SEE LOGIN
   */
  if (pathname === "/login" && user) {
    const appUrl = request.nextUrl.clone();
    appUrl.pathname = "/app";
    appUrl.search = "";
    return NextResponse.redirect(appUrl);
  }

  return response;
}
