export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let accesses = await prisma.smartTurnstileAccess.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (accesses.length === 0) {
      const defaultAccesses = [
        { gateCode: 'GATE-MAIN-01', locationName: 'Main Administration Entrance', visitorName: 'Dr. Arthur Pendelton', hostName: 'Dean of Engineering', accessMethod: 'FACIAL_BIOMETRIC', status: 'GRANTED' },
        { gateCode: 'GATE-NORTH-02', locationName: 'North Research Complex Gate', visitorName: 'Sarah Jenkins (Tech Vendor)', hostName: 'IT Infrastructure Lead', accessMethod: 'QR_BADGE', status: 'GRANTED' },
        { gateCode: 'GATE-DORM-04', locationName: 'Residential Quad Turnstile', visitorName: 'Unregistered Guest', hostName: 'Resident Advisor', accessMethod: 'MANUAL_OVERRIDE', status: 'PENDING_APPROVAL' },
      ];

      for (const a of defaultAccesses) {
        await prisma.smartTurnstileAccess.create({
          data: { schoolId: school.id, ...a },
        });
      }

      accesses = await prisma.smartTurnstileAccess.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(accesses);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch turnstile logs' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { gateCode, locationName, visitorName, hostName, accessMethod, status } = await req.json();

    if (!gateCode || !visitorName) {
      return NextResponse.json({ error: 'Gate code and visitor name are required' }, { status: 400 });
    }

    const access = await prisma.smartTurnstileAccess.create({
      data: {
        schoolId: school.id,
        gateCode,
        locationName: locationName || 'Main Perimeter Gate',
        visitorName,
        hostName: hostName || 'General Staff',
        accessMethod: accessMethod || 'QR_BADGE',
        status: status || 'GRANTED',
      },
    });

    return NextResponse.json(access);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create turnstile log' }, { status: 500 });
  }
}
