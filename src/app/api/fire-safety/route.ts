export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let systems = await prisma.smartFireSafetySystem.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (systems.length === 0) {
      const defaultSystems = [
        { panelCode: 'FIRE-PANEL-SCI-01', locationName: 'Science & Chemistry Labs Wing', smokePpm: 0.04, sprinklerPsi: 125.0, temperatureC: 21.5, alarmStatus: 'NORMAL' },
        { panelCode: 'FIRE-PANEL-DORM-03', locationName: 'Freshman Residential Dormitory Block', smokePpm: 0.06, sprinklerPsi: 118.5, temperatureC: 23.0, alarmStatus: 'NORMAL' },
        { panelCode: 'FIRE-PANEL-LIB-02', locationName: 'Central Library Archives & Rare Books', smokePpm: 0.02, sprinklerPsi: 130.0, temperatureC: 20.0, alarmStatus: 'NORMAL' },
      ];

      for (const s of defaultSystems) {
        await prisma.smartFireSafetySystem.create({
          data: { schoolId: school.id, ...s },
        });
      }

      systems = await prisma.smartFireSafetySystem.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(systems);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch fire safety systems' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { panelCode, locationName, smokePpm, sprinklerPsi, temperatureC, alarmStatus } = await req.json();

    if (!panelCode || !locationName) {
      return NextResponse.json({ error: 'Panel code and location name are required' }, { status: 400 });
    }

    const system = await prisma.smartFireSafetySystem.create({
      data: {
        schoolId: school.id,
        panelCode,
        locationName,
        smokePpm: parseFloat(smokePpm) || 0.05,
        sprinklerPsi: parseFloat(sprinklerPsi) || 120.0,
        temperatureC: parseFloat(temperatureC) || 22.0,
        alarmStatus: alarmStatus || 'NORMAL',
      },
    });

    return NextResponse.json(system);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create fire safety system' }, { status: 500 });
  }
}
