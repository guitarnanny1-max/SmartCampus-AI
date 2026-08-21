export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    let nodes = await (prisma as any).smartMicrogridHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (nodes.length === 0) {
      const defaultNodes = [
        { gridNodeCode: 'GRID-NODE-01', facilityName: 'Central Campus Solar & BESS Substation', solarWindMixPct: 88.4, batteryStorageMWh: 12.5, gridStabilityStatus: 'OPTIMAL_LOAD_BALANCING', aiDispatchOptimization: 'PREDICTIVE_PEAK_SHAVING' },
        { gridNodeCode: 'GRID-NODE-02', facilityName: 'Engineering & Quantum Lab Microgrid', solarWindMixPct: 65.2, batteryStorageMWh: 8.0, gridStabilityStatus: 'PEAK_SHAVING_ACTIVE', aiDispatchOptimization: 'ARBITRAGE_DISPATCH' },
        { gridNodeCode: 'GRID-NODE-03', facilityName: 'Student Residential Complex Power Hub', solarWindMixPct: 79.1, batteryStorageMWh: 15.2, gridStabilityStatus: 'AUTONOMOUS_ISLANDING', aiDispatchOptimization: 'EMERGENCY_BACKUP_RESERVE' },
      ];

      for (const n of defaultNodes) {
        await (prisma as any).smartMicrogridHub.create({
          data: { schoolId: school.id, ...n },
        });
      }

      nodes = await (prisma as any).smartMicrogridHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(nodes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch microgrid records' }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    const { gridNodeCode, facilityName, solarWindMixPct, batteryStorageMWh, gridStabilityStatus, aiDispatchOptimization } = await req.json();

    if (!gridNodeCode || !facilityName) {
      return NextResponse.json({ error: 'Grid node code and facility name are required' }, { status: 400 });
    }

    const node = await (prisma as any).smartMicrogridHub.create({
      data: {
        schoolId: school.id,
        gridNodeCode,
        facilityName,
        solarWindMixPct: parseFloat(solarWindMixPct) || 75.5,
        batteryStorageMWh: parseFloat(batteryStorageMWh) || 5.2,
        gridStabilityStatus: gridStabilityStatus || 'OPTIMAL_LOAD_BALANCING',
        aiDispatchOptimization: aiDispatchOptimization || 'PREDICTIVE_PEAK_SHAVING',
      },
    });

    return NextResponse.json(node);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register microgrid node' }, { status: 500 });
  }
}
