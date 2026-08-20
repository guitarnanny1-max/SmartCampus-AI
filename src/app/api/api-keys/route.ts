export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const headerList = headers();
    const userRole = headerList.get('x-user-role') || 'TENANT_ADMIN';

    if (userRole === 'VIEWER') {
      return NextResponse.json({ error: 'Permission denied: Viewers cannot create API keys' }, { status: 403 });
    }

    const school = await getCurrentSchool();
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Integration name is required' }, { status: 400 });
    }

    const randomString = crypto.randomBytes(16).toString('hex');
    const key = `sc_live_${school.subdomain}_${randomString}`;

    const apiKey = await prisma.apiKey.create({
      data: {
        schoolId: school.id,
        name,
        key,
      },
    });

    return NextResponse.json(apiKey);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create API key' }, { status: 500 });
  }
}
