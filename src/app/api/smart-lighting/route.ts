export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let fixtures = await prisma.smartLightingFixture.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (fixtures.length === 0) {
      const defaultFixtures = [
        { unitCode: 'LIGHT-QUAD-01', zoneName: 'Main Student Quad Walkway', brightnessPct: 85, motionSensing: true, powerDrawWatts: 42.5, status: 'ACTIVE' },
        { unitCode: 'LIGHT-PARK-03', zoneName: 'South Faculty Parking Lot', brightnessPct: 100, motionSensing: true, powerDrawWatts: 95.0, status: 'ACTIVE' },
        { unitCode: 'LIGHT-STAD-02', zoneName: 'Athletic Stadium Perimeter', brightnessPct: 60, motionSensing: false, powerDrawWatts: 120.0, status: 'DIMMED' },
      ];

      for (const f of defaultFixtures) {
        await prisma.smartLightingFixture.create({
          data: { schoolId: school.id, ...f },
        });
      }

      fixtures = await prisma.smartLightingFixture.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(fixtures);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch lighting fixtures' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { unitCode, zoneName, brightnessPct, motionSensing, powerDrawWatts, status } = await req.json();

    if (!unitCode || !zoneName) {
      return NextResponse.json({ error: 'Unit code and zone name are required' }, { status: 400 });
    }

    const fixture = await prisma.smartLightingFixture.create({
      data: {
        schoolId: school.id,
        unitCode,
        zoneName,
        brightnessPct: parseInt(brightnessPct) || 80,
        motionSensing: Boolean(motionSensing),
        powerDrawWatts: parseFloat(powerDrawWatts) || 45.0,
        status: status || 'ACTIVE',
      },
    });

    return NextResponse.json(fixture);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create lighting fixture' }, { status: 500 });
  }
}
