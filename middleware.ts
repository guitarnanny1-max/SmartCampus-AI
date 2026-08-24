import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // Set your production root domain and local development baseline
  const rootDomain = process.env.NODE_ENV === "production" 
    ? "smartcampusai.in" 
    : "localhost:3000";

  // Skip middleware for API routes, Next.js internal assets, and static files
  if (
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/_next") ||
    url.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  let subdomain = "";

  // Extract subdomain if the hostname matches [subdomain].[rootDomain]
  if (hostname.endsWith(`.${rootDomain}`)) {
    subdomain = hostname.replace(`.${rootDomain}`, "");
  }

  // If a valid tenant subdomain is found, rewrite the request to the dynamic route folder
  if (subdomain && subdomain !== "www") {
    return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
