import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for session authentication cookie
  const authToken = request.cookies.get('campus_auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Define protected enterprise routes
  const protectedPaths = [
    '/admissions',
    '/students',
    '/staff',
    '/exams',
    '/library',
    '/energy',
    '/transport',
    '/finance'
  ];

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  // If route requires authentication and token is missing, redirect to login
  if (isProtected && !authToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admissions/:path*',
    '/students/:path*',
    '/staff/:path*',
    '/exams/:path*',
    '/library/:path*',
    '/energy/:path*',
    '/transport/:path*',
    '/finance/:path*',
  ],
};
