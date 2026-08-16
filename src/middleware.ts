import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Define your base SaaS production domain (e.g., smartcampus.io or localhost:3000)
  const currentHost = hostname.includes('localhost')
    ? hostname.split(':')[0]
    : hostname.replace('.smartcampus.io', '');

  // Check for custom tenant subdomains (excluding www or root app)
  if (currentHost && currentHost !== 'smartcampus' && currentHost !== 'localhost' && !currentHost.includes('www')) {
    // Rewrite request to tenant-scoped route or pass custom headers
    const response = NextResponse.next();
    response.headers.set('x-tenant-subdomain', currentHost);
    return response;
  }

  // Protect post-login routes if no session token exists (simulation)
  const pathname = url.pathname;
  if (pathname.startsWith('/crm') || pathname.startsWith('/saas-admin') || pathname.startsWith('/settings')) {
    // In production, verify JWT/Auth cookie here
    // For demo purposes, we allow direct navigation through the login gateway
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
