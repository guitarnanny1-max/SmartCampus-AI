import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all routes under /admin except /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    // Note: For client-side localStorage checks, we also handle redirects in components,
    // but this middleware can check for cookies/headers if transitioning to cookie-based auth.
    // For now, we allow the request through to let the client-side session guard handle local storage auth.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
