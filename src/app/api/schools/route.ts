export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const schools = await prisma.school.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(schools);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch schools' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, subdomain, logoUrl } = await req.json();
    
    if (!name || !subdomain) {
      return NextResponse.json({ error: 'Name and subdomain are required' }, { status: 400 });
    }

    const cleanSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');

    const existing = await prisma.school.findUnique({
      where: { subdomain: cleanSubdomain },
    });

    if (existing) {
      return NextResponse.json({ error: 'Subdomain already exists' }, { status: 400 });
    }

    const school = await prisma.school.create({
      data: {
        name,
        subdomain: cleanSubdomain,
        logoUrl: logoUrl || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=100&h=100&fit=crop',
      },
    });

    return NextResponse.json(school);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create tenant school' }, { status: 500 });
  }
}
