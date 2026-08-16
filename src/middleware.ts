import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  
  // Extract subdomain for local development (e.g., dps.localhost:3000) or production (e.g., dps.smartcampus.ai)
  const subdomainMatch = hostname.match(/^(?:([a-z0-9-]+)\.)?(?:localhost:\d+|smartcampus\.ai)$/i);
  
  if (subdomainMatch && subdomainMatch[1] && subdomainMatch[1] !== 'www' && subdomainMatch[1] !== 'admin') {
    const subdomain = subdomainMatch[1];
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-school-subdomain', subdomain);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|admin).*)'],
};
