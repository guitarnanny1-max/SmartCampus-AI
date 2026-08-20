export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let fuelCells = await prisma.smartHydrogenFuelCellHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (fuelCells.length === 0) {
      const defaultCells = [
        { fuelCellCode: 'H2-STATION-01', stationName: 'Main Research Lab Clean Energy Vault', hydrogenPressureBar: 350.0, powerGenerationKw: 85.5, electrolyzerStatus: 'ACTIVE_GENERATION', aiStorageOptimization: 'BALANCED_PEAK_SHAVING' },
        { fuelCellCode: 'H2-STATION-02', stationName: 'Engineering Complex Hydrogen Bank', hydrogenPressureBar: 320.5, powerGenerationKw: 62.0, electrolyzerStatus: 'STANDBY_RESERVE', aiStorageOptimization: 'MAX_CAPACITY_HOLD' },
        { fuelCellCode: 'H2-STATION-03', stationName: 'Transit Fleet H2 Refueling Depot', hydrogenPressureBar: 380.0, powerGenerationKw: 110.0, electrolyzerStatus: 'ACTIVE_GENERATION', aiStorageOptimization: 'RAPID_DISPATCH' },
      ];

      for (const fc of defaultCells) {
        await prisma.smartHydrogenFuelCellHub.create({
          data: { schoolId: school.id, ...fc },
        });
      }

      fuelCells = await prisma.smartHydrogenFuelCellHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(fuelCells);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch hydrogen fuel cell records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { fuelCellCode, stationName, hydrogenPressureBar, powerGenerationKw, electrolyzerStatus, aiStorageOptimization } = await req.json();

    if (!fuelCellCode || !stationName) {
      return NextResponse.json({ error: 'Fuel cell code and station name are required' }, { status: 400 });
    }

    const fuelCell = await prisma.smartHydrogenFuelCellHub.create({
      data: {
        schoolId: school.id,
        fuelCellCode,
        stationName,
        hydrogenPressureBar: parseFloat(hydrogenPressureBar) || 350.0,
        powerGenerationKw: parseFloat(powerGenerationKw) || 75.0,
        electrolyzerStatus: electrolyzerStatus || 'ACTIVE_GENERATION',
        aiStorageOptimization: aiStorageOptimization || 'BALANCED_PEAK_SHAVING',
      },
    });

    return NextResponse.json(fuelCell);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register hydrogen fuel cell hub' }, { status: 500 });
  }
}
