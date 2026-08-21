export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    let grids = await (prisma as any).smartEnergyGrid.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (grids.length === 0) {
      const defaultGrids = [
        { gridZone: 'ZONE-A-SOLAR', renewableSource: 'Rooftop Photovoltaic Solar Array', energyOutputKw: 850.5, carbonOffsetKg: 3400.0, gridStatus: 'OPTIMIZED' },
        { gridZone: 'ZONE-B-WIND', renewableSource: 'Campus Perimeter Micro-Turbines', energyOutputKw: 420.0, carbonOffsetKg: 1850.0, gridStatus: 'OPTIMIZED' },
        { gridZone: 'ZONE-C-GEOTHERMAL', renewableSource: 'Deep Geothermal Heat Pumps', energyOutputKw: 620.5, carbonOffsetKg: 2900.0, gridStatus: 'BALANCING' },
      ];

      for (const g of defaultGrids) {
        await (prisma as any).smartEnergyGrid.create({
          data: { schoolId: school.id, ...g },
        });
      }

      grids = await (prisma as any).smartEnergyGrid.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(grids);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch energy grid records' }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    const { gridZone, renewableSource, energyOutputKw, carbonOffsetKg, gridStatus } = await req.json();

    if (!gridZone || !renewableSource) {
      return NextResponse.json({ error: 'Grid zone and renewable source are required' }, { status: 400 });
    }

    const grid = await (prisma as any).smartEnergyGrid.create({
      data: {
        schoolId: school.id,
        gridZone,
        renewableSource,
        energyOutputKw: parseFloat(energyOutputKw) || 500.0,
        carbonOffsetKg: parseFloat(carbonOffsetKg) || 1500.0,
        gridStatus: gridStatus || 'OPTIMIZED',
      },
    });

    return NextResponse.json(grid);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create energy grid record' }, { status: 500 });
  }
}
