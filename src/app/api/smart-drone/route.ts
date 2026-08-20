export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let hubs = await prisma.smartDroneHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (hubs.length === 0) {
      const defaultHubs = [
        { hubCode: 'DRONE-HUB-01', hubName: 'Main Campus Quad VTOL & Logistics Terminal', activeFleetCount: 65, vtolLandingPads: 12, avoidanceLatencyMs: 0.9, aiSwarmMode: 'DEEP_REINFORCEMENT_LEARNING_SWARM_ROUTING' },
        { hubCode: 'DRONE-HUB-02', hubName: 'Medical Center Emergency Blood & Organ Delivery', activeFleetCount: 30, vtolLandingPads: 6, avoidanceLatencyMs: 0.5, aiSwarmMode: 'DYNAMIC_OBSTACLE_AVOIDANCE_VECTOR' },
        { hubCode: 'DRONE-HUB-03', hubName: 'Research Park Heavy Cargo Aerial Corridor', activeFleetCount: 20, vtolLandingPads: 4, avoidanceLatencyMs: 1.5, aiSwarmMode: 'ZERO_CARBON_AUTONOMOUS_CORRIDOR' },
      ];

      for (const h of defaultHubs) {
        await prisma.smartDroneHub.create({
          data: { schoolId: school.id, ...h },
        });
      }

      hubs = await prisma.smartDroneHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(hubs);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch drone mobility records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { hubCode, hubName, activeFleetCount, vtolLandingPads, avoidanceLatencyMs, aiSwarmMode } = await req.json();

    if (!hubCode || !hubName) {
      return NextResponse.json({ error: 'Hub code and name are required' }, { status: 400 });
    }

    const hub = await prisma.smartDroneHub.create({
      data: {
        schoolId: school.id,
        hubCode,
        hubName,
        activeFleetCount: parseInt(activeFleetCount) || 45,
        vtolLandingPads: parseInt(vtolLandingPads) || 8,
        avoidanceLatencyMs: parseFloat(avoidanceLatencyMs) || 1.2,
        aiSwarmMode: aiSwarmMode || 'DEEP_REINFORCEMENT_LEARNING_SWARM_ROUTING',
      },
    });

    return NextResponse.json(hub);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register drone mobility hub' }, { status: 500 });
  }
}
