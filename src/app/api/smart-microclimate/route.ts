export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let zones = await prisma.smartMicroclimateHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (zones.length === 0) {
      const defaultZones = [
        { zoneCode: 'ZONE-CLIM-01', zoneName: 'Botanical Conservatory Delta', humidityPct: 60.5, co2LevelsPpm: 450.0, tempCelsius: 24.0, aiClimateControlMode: 'ADAPTIVE_BIOSPHERE_STABILIZATION' },
        { zoneCode: 'ZONE-CLIM-02', zoneName: 'Outdoor Research Plaza North', humidityPct: 45.2, co2LevelsPpm: 410.0, tempCelsius: 18.5, aiClimateControlMode: 'PREDICTIVE_WEATHER_SHIELD_DEPLOYMENT' },
        { zoneCode: 'ZONE-CLIM-03', zoneName: 'Experimental Alpine Growth Chamber', humidityPct: 35.0, co2LevelsPpm: 380.0, tempCelsius: 12.0, aiClimateControlMode: 'EXTREME_CONDITIONS_SIMULATION' },
      ];

      for (const z of defaultZones) {
        await prisma.smartMicroclimateHub.create({
          data: { schoolId: school.id, ...z },
        });
      }

      zones = await prisma.smartMicroclimateHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(zones);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch microclimate records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { zoneCode, zoneName, humidityPct, co2LevelsPpm, tempCelsius, aiClimateControlMode } = await req.json();

    if (!zoneCode || !zoneName) {
      return NextResponse.json({ error: 'Zone code and name are required' }, { status: 400 });
    }

    const zone = await prisma.smartMicroclimateHub.create({
      data: {
        schoolId: school.id,
        zoneCode,
        zoneName,
        humidityPct: parseFloat(humidityPct) || 50.0,
        co2LevelsPpm: parseFloat(co2LevelsPpm) || 400.0,
        tempCelsius: parseFloat(tempCelsius) || 20.0,
        aiClimateControlMode: aiClimateControlMode || 'ADAPTIVE_BIOSPHERE_STABILIZATION',
      },
    });

    return NextResponse.json(zone);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register climate zone' }, { status: 500 });
  }
}
