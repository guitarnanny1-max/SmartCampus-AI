export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let vehicles = await prisma.smartTransportationHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (vehicles.length === 0) {
      const defaultVehicles = [
        { vehicleId: 'HYPER-POD-001', routeIdentifier: 'CORE-CAMPUS-LOOP', podVelocityKph: 480.0, magneticSuspensionStabilityPct: 99.95, passengerOccupancy: 15, aiTrafficRoutingMode: 'DYNAMIC_PREDICTIVE_FLOW_OPTIMIZATION' },
        { vehicleId: 'SHUTTLE-A-42', routeIdentifier: 'DORM-TO-LAB-EXPRESS', podVelocityKph: 85.0, magneticSuspensionStabilityPct: 99.8, passengerOccupancy: 8, aiTrafficRoutingMode: 'AUTONOMOUS_SWARM_INTELLIGENCE' },
        { vehicleId: 'HYPER-POD-002', routeIdentifier: 'RESEARCH-PARK-LINK', podVelocityKph: 510.0, magneticSuspensionStabilityPct: 99.92, passengerOccupancy: 10, aiTrafficRoutingMode: 'NEURAL_CONGESTION_AVOIDANCE' },
      ];

      for (const v of defaultVehicles) {
        await prisma.smartTransportationHub.create({
          data: { schoolId: school.id, ...v },
        });
      }

      vehicles = await prisma.smartTransportationHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(vehicles);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch transportation records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { vehicleId, routeIdentifier, podVelocityKph, magneticSuspensionStabilityPct, passengerOccupancy, aiTrafficRoutingMode } = await req.json();

    if (!vehicleId || !routeIdentifier) {
      return NextResponse.json({ error: 'Vehicle ID and route identifier are required' }, { status: 400 });
    }

    const vehicle = await prisma.smartTransportationHub.create({
      data: {
        schoolId: school.id,
        vehicleId,
        routeIdentifier,
        podVelocityKph: parseFloat(podVelocityKph) || 100.0,
        magneticSuspensionStabilityPct: parseFloat(magneticSuspensionStabilityPct) || 99.0,
        passengerOccupancy: parseInt(passengerOccupancy) || 0,
        aiTrafficRoutingMode: aiTrafficRoutingMode || 'DYNAMIC_PREDICTIVE_FLOW_OPTIMIZATION',
      },
    });

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register vehicle' }, { status: 500 });
  }
}
