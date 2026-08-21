export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function POST(request: any): Promise<NextResponse> {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.set('admin_session', '', { maxAge: 0, path: '/' });
  return response;
}
