export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let facilities = await prisma.smartWaterDesalinationHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (facilities.length === 0) {
      const defaultFacilities = [
        { facilityCode: 'WATER-FAC-01', facilityName: 'Central Campus Rainwater Harvesting & RO Plant', waterPurifiedLiters: 125000.0, membranePurityPct: 99.4, tdsLevelPpm: 35.0, aiFiltrationOptimization: 'REVERSE_OSMOSIS_AI_BACKWASH' },
        { facilityCode: 'WATER-FAC-02', facilityName: 'Athletic Complex Graywater Recycling Hub', waterPurifiedLiters: 85000.0, membranePurityPct: 98.2, tdsLevelPpm: 55.0, aiFiltrationOptimization: 'UV_BIO_FOULING_PREVENTION' },
        { facilityCode: 'WATER-FAC-03', facilityName: 'Science Labs Desalination & Ion Exchange Unit', waterPurifiedLiters: 64000.0, membranePurityPct: 99.8, tdsLevelPpm: 12.0, aiFiltrationOptimization: 'ULTRA_PURE_RESIN_REGENERATION' },
      ];

      for (const f of defaultFacilities) {
        await prisma.smartWaterDesalinationHub.create({
          data: { schoolId: school.id, ...f },
        });
      }

      facilities = await prisma.smartWaterDesalinationHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(facilities);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch water desalination records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { facilityCode, facilityName, waterPurifiedLiters, membranePurityPct, tdsLevelPpm, aiFiltrationOptimization } = await req.json();

    if (!facilityCode || !facilityName) {
      return NextResponse.json({ error: 'Facility code and name are required' }, { status: 400 });
    }

    const facility = await prisma.smartWaterDesalinationHub.create({
      data: {
        schoolId: school.id,
        facilityCode,
        facilityName,
        waterPurifiedLiters: parseFloat(waterPurifiedLiters) || 50000.0,
        membranePurityPct: parseFloat(membranePurityPct) || 99.1,
        tdsLevelPpm: parseFloat(tdsLevelPpm) || 45.0,
        aiFiltrationOptimization: aiFiltrationOptimization || 'REVERSE_OSMOSIS_AI_BACKWASH',
      },
    });

    return NextResponse.json(facility);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register water facility' }, { status: 500 });
  }
}
