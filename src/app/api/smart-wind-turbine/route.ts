export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let turbines = await prisma.smartWindTurbineMicrogrid.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (turbines.length === 0) {
      const defaultTurbines = [
        { turbineCode: 'WT-RIDGE-01', turbineName: 'North Ridge Wind Array Alpha', rotorSpeedRpm: 21.0, powerOutputKw: 155.0, windYawAngleDeg: 42.5, aiYawOptimization: 'ACTIVE_ALIGNMENT' },
        { turbineCode: 'WT-VALLEY-02', turbineName: 'Sustainability Park Turbine Beta', rotorSpeedRpm: 16.2, powerOutputKw: 110.5, windYawAngleDeg: 12.0, aiYawOptimization: 'ACTIVE_ALIGNMENT' },
        { turbineCode: 'WT-HILL-03', turbineName: 'Engineering Hill Turbine Gamma', rotorSpeedRpm: 24.5, powerOutputKw: 190.0, windYawAngleDeg: 88.0, aiYawOptimization: 'STORM_BRAKING' },
      ];

      for (const t of defaultTurbines) {
        await prisma.smartWindTurbineMicrogrid.create({
          data: { schoolId: school.id, ...t },
        });
      }

      turbines = await prisma.smartWindTurbineMicrogrid.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(turbines);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch wind turbine records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { turbineCode, turbineName, rotorSpeedRpm, powerOutputKw, windYawAngleDeg, aiYawOptimization } = await req.json();

    if (!turbineCode || !turbineName) {
      return NextResponse.json({ error: 'Turbine code and name are required' }, { status: 400 });
    }

    const turbine = await prisma.smartWindTurbineMicrogrid.create({
      data: {
        schoolId: school.id,
        turbineCode,
        turbineName,
        rotorSpeedRpm: parseFloat(rotorSpeedRpm) || 18.5,
        powerOutputKw: parseFloat(powerOutputKw) || 125.0,
        windYawAngleDeg: parseFloat(windYawAngleDeg) || 45.0,
        aiYawOptimization: aiYawOptimization || 'ACTIVE_ALIGNMENT',
      },
    });

    return NextResponse.json(turbine);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register wind turbine' }, { status: 500 });
  }
}
