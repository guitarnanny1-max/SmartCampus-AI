import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    const headerList = headers();
    const userRole = headerList.get('x-user-role') || 'TENANT_ADMIN';

    if (userRole === 'VIEWER') {
      return NextResponse.json({ error: 'Permission denied: Viewers cannot modify tenant settings' }, { status: 403 });
    }

    const school = await getCurrentSchool();
    const { name, logoUrl } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Institution name is required' }, { status: 400 });
    }

    const updatedSchool = await prisma.school.update({
      where: { id: school.id },
      data: {
        name,
        logoUrl: logoUrl || school.logoUrl,
      },
    });

    return NextResponse.json(updatedSchool);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update tenant settings' }, { status: 500 });
  }
}
