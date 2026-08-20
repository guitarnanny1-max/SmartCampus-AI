export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let drones = await prisma.autonomousDronePatrol.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (drones.length === 0) {
      const defaultDrones = [
        { droneCode: 'DRONE-ALPHA-01', sectorName: 'North Perimeter & Sports Complex', batteryPct: 84, patrolStatus: 'PATROLLING', aiIntrusions: 0, currentAltitudeM: 50 },
        { droneCode: 'DRONE-BETA-02', sectorName: 'Residential Hostels & Quad', batteryPct: 62, patrolStatus: 'RETURNING_TO_DOCK', aiIntrusions: 1, currentAltitudeM: 35 },
        { droneCode: 'DRONE-GAMMA-03', sectorName: 'Research & Innovation Labs', batteryPct: 95, patrolStatus: 'STATIONARY_GUARD', aiIntrusions: 0, currentAltitudeM: 40 },
      ];

      for (const d of defaultDrones) {
        await prisma.autonomousDronePatrol.create({
          data: { schoolId: school.id, ...d },
        });
      }

      drones = await prisma.autonomousDronePatrol.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(drones);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch drone patrols' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { droneCode, sectorName, batteryPct, patrolStatus, aiIntrusions, currentAltitudeM } = await req.json();

    if (!droneCode || !sectorName) {
      return NextResponse.json({ error: 'Drone code and sector name are required' }, { status: 400 });
    }

    const drone = await prisma.autonomousDronePatrol.create({
      data: {
        schoolId: school.id,
        droneCode,
        sectorName,
        batteryPct: parseInt(batteryPct) || 90,
        patrolStatus: patrolStatus || 'PATROLLING',
        aiIntrusions: parseInt(aiIntrusions) || 0,
        currentAltitudeM: parseInt(currentAltitudeM) || 45,
      },
    });

    return NextResponse.json(drone);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create drone patrol' }, { status: 500 });
  }
}
