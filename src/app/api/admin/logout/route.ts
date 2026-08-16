import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.set('admin_session', '', { maxAge: 0, path: '/' });
  return response;
}
