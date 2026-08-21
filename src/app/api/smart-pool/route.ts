export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    let pools = await (prisma as any).smartPoolSafety.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (pools.length === 0) {
      const defaultPools = [
        { poolCode: 'POOL-OLYMPIC-01', poolName: 'Olympic Aquatic Center Main Pool', waterTempC: 26.8, phLevel: 7.4, chlorinePpm: 2.1, swimmerCount: 14, aiSafetyStatus: 'SECURE_MONITORING' },
        { poolCode: 'POOL-DIVE-02', poolName: 'University Diving & Training Basin', waterTempC: 28.2, phLevel: 7.3, chlorinePpm: 1.9, swimmerCount: 4, aiSafetyStatus: 'SECURE_MONITORING' },
        { poolCode: 'POOL-THERAPY-03', poolName: 'Rehabilitation Hydrotherapy Pool', waterTempC: 32.5, phLevel: 7.5, chlorinePpm: 2.2, swimmerCount: 2, aiSafetyStatus: 'SECURE_MONITORING' },
      ];

      for (const p of defaultPools) {
        await (prisma as any).smartPoolSafety.create({
          data: { schoolId: school.id, ...p },
        });
      }

      pools = await (prisma as any).smartPoolSafety.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(pools);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch smart pool safety records' }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    const { poolCode, poolName, waterTempC, phLevel, chlorinePpm, swimmerCount, aiSafetyStatus } = await req.json();

    if (!poolCode || !poolName) {
      return NextResponse.json({ error: 'Pool code and name are required' }, { status: 400 });
    }

    const pool = await (prisma as any).smartPoolSafety.create({
      data: {
        schoolId: school.id,
        poolCode,
        poolName,
        waterTempC: parseFloat(waterTempC) || 27.5,
        phLevel: parseFloat(phLevel) || 7.4,
        chlorinePpm: parseFloat(chlorinePpm) || 2.0,
        swimmerCount: parseInt(swimmerCount) || 0,
        aiSafetyStatus: aiSafetyStatus || 'SECURE_MONITORING',
      },
    });

    return NextResponse.json(pool);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register smart pool' }, { status: 500 });
  }
}
