export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    let digesters = await (prisma as any).smartBioDigesterHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (digesters.length === 0) {
      const defaultDigesters = [
        { digesterCode: 'BIO-DIGEST-01', facilityName: 'Main Campus Dining Hall Organic Vault', methaneCaptureM3: 52.8, organicFeedstockKg: 420.0, microbialHealth: 'OPTIMAL_ACTIVITY', aiBiogasOptimization: 'MAX_YIELD_SCHEDULING' },
        { digesterCode: 'BIO-DIGEST-02', facilityName: 'Agricultural Sciences Biomass Facility', methaneCaptureM3: 68.4, organicFeedstockKg: 580.0, microbialHealth: 'HIGH_CONVERSION', aiBiogasOptimization: 'FEEDSTOCK_BALANCING' },
        { digesterCode: 'BIO-DIGEST-03', facilityName: 'Student Residence Food Waste Hub', methaneCaptureM3: 39.1, organicFeedstockKg: 290.0, microbialHealth: 'STABLE_CULTURE', aiBiogasOptimization: 'MAX_YIELD_SCHEDULING' },
      ];

      for (const d of defaultDigesters) {
        await (prisma as any).smartBioDigesterHub.create({
          data: { schoolId: school.id, ...d },
        });
      }

      digesters = await (prisma as any).smartBioDigesterHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(digesters);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch bio-digester records' }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    const { digesterCode, facilityName, methaneCaptureM3, organicFeedstockKg, microbialHealth, aiBiogasOptimization } = await req.json();

    if (!digesterCode || !facilityName) {
      return NextResponse.json({ error: 'Digester code and facility name are required' }, { status: 400 });
    }

    const digester = await (prisma as any).smartBioDigesterHub.create({
      data: {
        schoolId: school.id,
        digesterCode,
        facilityName,
        methaneCaptureM3: parseFloat(methaneCaptureM3) || 45.5,
        organicFeedstockKg: parseFloat(organicFeedstockKg) || 350.0,
        microbialHealth: microbialHealth || 'OPTIMAL_ACTIVITY',
        aiBiogasOptimization: aiBiogasOptimization || 'MAX_YIELD_SCHEDULING',
      },
    });

    return NextResponse.json(digester);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register bio-digester station' }, { status: 500 });
  }
}
