export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    let geothermalPlants = await (prisma as any).smartGeothermalEnergyHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (geothermalPlants.length === 0) {
      const defaultPlants = [
        { plantCode: 'GEO-LOOP-01', plantName: 'Central Campus Library Geothermal Array', loopTempC: 13.8, flowRateLpm: 145.0, efficiencyPct: 96.2, aiCirculationMode: 'AUTO_THERMAL_BALANCE' },
        { plantCode: 'GEO-LOOP-02', plantName: 'Engineering & Science Quad Loop Beta', loopTempC: 15.2, flowRateLpm: 110.5, efficiencyPct: 92.8, aiCirculationMode: 'DEEP_STAGE_COOLING' },
        { plantCode: 'GEO-LOOP-03', plantName: 'Student Residence Geothermal Hub', loopTempC: 14.1, flowRateLpm: 130.0, efficiencyPct: 95.0, aiCirculationMode: 'AUTO_THERMAL_BALANCE' },
      ];

      for (const p of defaultPlants) {
        await (prisma as any).smartGeothermalEnergyHub.create({
          data: { schoolId: school.id, ...p },
        });
      }

      geothermalPlants = await (prisma as any).smartGeothermalEnergyHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(geothermalPlants);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch geothermal energy records' }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    const { plantCode, plantName, loopTempC, flowRateLpm, efficiencyPct, aiCirculationMode } = await req.json();

    if (!plantCode || !plantName) {
      return NextResponse.json({ error: 'Plant code and plant name are required' }, { status: 400 });
    }

    const plant = await (prisma as any).smartGeothermalEnergyHub.create({
      data: {
        schoolId: school.id,
        plantCode,
        plantName,
        loopTempC: parseFloat(loopTempC) || 14.5,
        flowRateLpm: parseFloat(flowRateLpm) || 120.0,
        efficiencyPct: parseFloat(efficiencyPct) || 94.5,
        aiCirculationMode: aiCirculationMode || 'AUTO_THERMAL_BALANCE',
      },
    });

    return NextResponse.json(plant);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register geothermal energy plant' }, { status: 500 });
  }
}
