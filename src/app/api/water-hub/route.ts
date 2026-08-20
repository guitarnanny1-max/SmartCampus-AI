export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let reservoirs = await prisma.smartWaterReservoir.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (reservoirs.length === 0) {
      const defaultReservoirs = [
        { reservoirName: 'Main Campus Overhead Tank Alpha', location: 'Science Block Roof', capacityLtrs: 50000, fillLevelPct: 88, tdsPpm: 135, phLevel: 7.4, pumpStatus: 'AUTO_RUNNING' },
        { reservoirName: 'Hostel Block Beta Cistern', location: 'Residential Quad', capacityLtrs: 100000, fillLevelPct: 62, tdsPpm: 152, phLevel: 7.1, pumpStatus: 'STANDBY' },
        { reservoirName: 'Sports Complex Underground Sump', location: 'Stadium Ground Level', capacityLtrs: 75000, fillLevelPct: 94, tdsPpm: 128, phLevel: 7.3, pumpStatus: 'AUTO_RUNNING' },
      ];

      for (const res of defaultReservoirs) {
        await prisma.smartWaterReservoir.create({
          data: { schoolId: school.id, ...res },
        });
      }

      reservoirs = await prisma.smartWaterReservoir.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(reservoirs);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch water reservoirs' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { reservoirName, location, capacityLtrs, fillLevelPct, tdsPpm, phLevel, pumpStatus } = await req.json();

    if (!reservoirName || !location || !capacityLtrs) {
      return NextResponse.json({ error: 'Reservoir name, location and capacity are required' }, { status: 400 });
    }

    const reservoir = await prisma.smartWaterReservoir.create({
      data: {
        schoolId: school.id,
        reservoirName,
        location,
        capacityLtrs: parseFloat(capacityLtrs) || 50000,
        fillLevelPct: parseInt(fillLevelPct) || 80,
        tdsPpm: parseInt(tdsPpm) || 140,
        phLevel: parseFloat(phLevel) || 7.2,
        pumpStatus: pumpStatus || 'AUTO_RUNNING',
      },
    });

    return NextResponse.json(reservoir);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create water reservoir' }, { status: 500 });
  }
}
