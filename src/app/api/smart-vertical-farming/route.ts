export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let facilities = await prisma.smartVerticalFarmingHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (facilities.length === 0) {
      const defaultFacilities = [
        { greenhouseCode: 'AGRO-FAC-01', facilityName: 'Campus Dining Rooftop Aeroponic Tower Alpha', cropYieldKg: 2400.0, nutrientMistpH: 5.8, ledPhotosynthesisPar: 480.0, aiClimateControlMode: 'DYNAMIC_SPECTRAL_LIGHTING_OPTIMIZATION' },
        { greenhouseCode: 'AGRO-FAC-02', facilityName: 'Botany & Plant Genomics Research Greenhouse', cropYieldKg: 1450.0, nutrientMistpH: 6.1, ledPhotosynthesisPar: 520.0, aiClimateControlMode: 'PRECISION_ROOT_MIST_SCHEDULING' },
        { greenhouseCode: 'AGRO-FAC-03', facilityName: 'Subterranean Microgreens & Herb Cultivator', cropYieldKg: 3100.0, nutrientMistpH: 5.7, ledPhotosynthesisPar: 420.0, aiClimateControlMode: 'AUTONOMOUS_TRANSPIRATION_REGULATION' },
      ];

      for (const f of defaultFacilities) {
        await prisma.smartVerticalFarmingHub.create({
          data: { schoolId: school.id, ...f },
        });
      }

      facilities = await prisma.smartVerticalFarmingHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(facilities);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch vertical farming records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { greenhouseCode, facilityName, cropYieldKg, nutrientMistpH, ledPhotosynthesisPar, aiClimateControlMode } = await req.json();

    if (!greenhouseCode || !facilityName) {
      return NextResponse.json({ error: 'Greenhouse code and name are required' }, { status: 400 });
    }

    const facility = await prisma.smartVerticalFarmingHub.create({
      data: {
        schoolId: school.id,
        greenhouseCode,
        facilityName,
        cropYieldKg: parseFloat(cropYieldKg) || 1200.0,
        nutrientMistpH: parseFloat(nutrientMistpH) || 5.8,
        ledPhotosynthesisPar: parseFloat(ledPhotosynthesisPar) || 450.0,
        aiClimateControlMode: aiClimateControlMode || 'DYNAMIC_SPECTRAL_LIGHTING_OPTIMIZATION',
      },
    });

    return NextResponse.json(facility);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register greenhouse facility' }, { status: 500 });
  }
}
