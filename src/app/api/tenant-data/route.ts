export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    const headerList = headers();
    const userRole = headerList.get('x-user-role') || 'TENANT_ADMIN';

    // RBAC Check: Viewers cannot create or modify records
    if (userRole === 'VIEWER') {
      return NextResponse.json({ error: 'Permission denied: Viewers have read-only access' }, { status: 403 });
    }

    const school = await getCurrentSchool();
    const body = await req.json();
    const { type, zoneName, solar, hvac, status, name, rollNo, cgpa } = body;

    if (type === 'facility') {
      if (!zoneName) return NextResponse.json({ error: 'Zone name is required' }, { status: 400 });
      const facility = await prisma.facility.create({
        data: {
          schoolId: school.id,
          zoneName,
          solar: solar || '40 kW',
          hvac: hvac || 'Optimized (22°C)',
          status: status || 'Optimal',
        },
      });
      return NextResponse.json(facility);
    }

    if (type === 'student') {
      if (!name || !rollNo) return NextResponse.json({ error: 'Name and roll number are required' }, { status: 400 });
      const student = await prisma.student.create({
        data: {
          schoolId: school.id,
          name,
          rollNo,
          cgpa: parseFloat(cgpa) || 9.0,
        },
      });
      return NextResponse.json(student);
    }

    return NextResponse.json({ error: 'Invalid record type' }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add record' }, { status: 500 });
  }
}
