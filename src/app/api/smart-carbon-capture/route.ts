export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let facilities = await prisma.smartCarbonCaptureHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (facilities.length === 0) {
      const defaultFacilities = [
        { facilityCode: 'DAC-HUB-01', locationName: 'Engineering Research Rooftop DAC Unit A', co2CapturedTons: 18.4, sorbentEfficiencyPct: 96.2, purityLevelPct: 99.4, aiCaptureOptimization: 'DYNAMIC_SORBENT_REGENERATION' },
        { facilityCode: 'DAC-HUB-02', locationName: 'Green Science Quad Carbon Sequestration Vault', co2CapturedTons: 24.1, sorbentEfficiencyPct: 95.5, purityLevelPct: 99.1, aiCaptureOptimization: 'WEATHER_SYNCED_AIRFLOW' },
        { facilityCode: 'DAC-HUB-03', locationName: 'Main Campus Gate Atmospheric Scrubber', co2CapturedTons: 14.8, sorbentEfficiencyPct: 93.9, purityLevelPct: 98.8, aiCaptureOptimization: 'PEAK_WIND_CAPTURE' },
      ];

      for (const f of defaultFacilities) {
        await prisma.smartCarbonCaptureHub.create({
          data: { schoolId: school.id, ...f },
        });
      }

      facilities = await prisma.smartCarbonCaptureHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(facilities);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch carbon capture records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { facilityCode, locationName, co2CapturedTons, sorbentEfficiencyPct, purityLevelPct, aiCaptureOptimization } = await req.json();

    if (!facilityCode || !locationName) {
      return NextResponse.json({ error: 'Facility code and location name are required' }, { status: 400 });
    }

    const facility = await prisma.smartCarbonCaptureHub.create({
      data: {
        schoolId: school.id,
        facilityCode,
        locationName,
        co2CapturedTons: parseFloat(co2CapturedTons) || 12.5,
        sorbentEfficiencyPct: parseFloat(sorbentEfficiencyPct) || 94.8,
        purityLevelPct: parseFloat(purityLevelPct) || 99.2,
        aiCaptureOptimization: aiCaptureOptimization || 'DYNAMIC_SORBENT_REGENERATION',
      },
    });

    return NextResponse.json(facility);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register carbon capture facility' }, { status: 500 });
  }
}
