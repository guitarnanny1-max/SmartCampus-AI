export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let fleets = await prisma.smartAutonomousFleetHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (fleets.length === 0) {
      const defaultFleets = [
        { fleetCode: 'DRONE-FLEET-01', vehicleName: 'Library-to-Lab Autonomous Delivery Drone Alpha', payloadCapacityKg: 8.5, batteryRangePct: 92.0, navigationAccuracyPct: 99.7, aiFleetOptimization: 'REAL_TIME_OBSTACLE_REROUTING' },
        { fleetCode: 'ROVER-FLEET-02', vehicleName: 'Mail & Package Ground Rover Quad Unit', payloadCapacityKg: 45.0, batteryRangePct: 84.5, navigationAccuracyPct: 99.2, aiFleetOptimization: 'MULTI_STOP_CLUSTER_ROUTING' },
        { fleetCode: 'DRONE-FLEET-03', vehicleName: 'Medical Emergency Rapid Dispatch Drone', payloadCapacityKg: 5.0, batteryRangePct: 96.0, navigationAccuracyPct: 99.9, aiFleetOptimization: 'PRIORITY_CORRIDOR_OVERRIDE' },
      ];

      for (const f of defaultFleets) {
        await prisma.smartAutonomousFleetHub.create({
          data: { schoolId: school.id, ...f },
        });
      }

      fleets = await prisma.smartAutonomousFleetHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(fleets);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch autonomous fleet records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { fleetCode, vehicleName, payloadCapacityKg, batteryRangePct, navigationAccuracyPct, aiFleetOptimization } = await req.json();

    if (!fleetCode || !vehicleName) {
      return NextResponse.json({ error: 'Fleet code and vehicle name are required' }, { status: 400 });
    }

    const fleet = await prisma.smartAutonomousFleetHub.create({
      data: {
        schoolId: school.id,
        fleetCode,
        vehicleName,
        payloadCapacityKg: parseFloat(payloadCapacityKg) || 15.0,
        batteryRangePct: parseFloat(batteryRangePct) || 88.5,
        navigationAccuracyPct: parseFloat(navigationAccuracyPct) || 99.4,
        aiFleetOptimization: aiFleetOptimization || 'REAL_TIME_OBSTACLE_REROUTING',
      },
    });

    return NextResponse.json(fleet);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register autonomous vehicle' }, { status: 500 });
  }
}
