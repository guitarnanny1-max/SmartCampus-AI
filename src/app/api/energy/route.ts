export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let grids = await prisma.smartEnergyGrid.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (grids.length === 0) {
      const defaultGrids = [
        { sectorName: 'Engineering & Research Hub', solarOutputKw: 340.5, gridDrawKw: 120.0, batteryLevel: 92, aiMode: 'ECO_PEAK', status: 'OPTIMIZED' },
        { sectorName: 'Student Residence & Hostels', solarOutputKw: 180.2, gridDrawKw: 210.5, batteryLevel: 78, aiMode: 'LOAD_BALANCED', status: 'OPTIMIZED' },
        { sectorName: 'Administrative & Library Complex', solarOutputKw: 95.0, gridDrawKw: 65.0, batteryLevel: 98, aiMode: 'MAX_EFFICIENCY', status: 'PEAK_PERFORMANCE' },
      ];

      for (const gr of defaultGrids) {
        await prisma.smartEnergyGrid.create({
          data: { schoolId: school.id, ...gr },
        });
      }

      grids = await prisma.smartEnergyGrid.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(grids);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch smart energy grid metrics' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { sectorName, solarOutputKw, gridDrawKw, batteryLevel, aiMode } = await req.json();

    if (!sectorName) {
      return NextResponse.json({ error: 'Sector name is required' }, { status: 400 });
    }

    const grid = await prisma.smartEnergyGrid.create({
      data: {
        schoolId: school.id,
        sectorName,
        solarOutputKw: Number(solarOutputKw) || 150.0,
        gridDrawKw: Number(gridDrawKw) || 100.0,
        batteryLevel: Number(batteryLevel) || 85,
        aiMode: aiMode || 'ECO_PEAK',
        status: 'OPTIMIZED',
      },
    });

    return NextResponse.json(grid);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create energy grid node' }, { status: 500 });
  }
}
