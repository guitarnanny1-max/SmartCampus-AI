export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let units = await prisma.smartWasteSortingHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (units.length === 0) {
      const defaultUnits = [
        { sortingUnitCode: 'SORT-UNIT-01', facilityName: 'Student Dining Hall Central Circular Hub', wasteDiversionRatePct: 92.4, compostOutputKg: 680.0, recyclingPurityPct: 98.2, aiSortingMode: 'COMPUTER_VISION_POLYMER_SORT' },
        { sortingUnitCode: 'SORT-UNIT-02', facilityName: 'Science Laboratories Hazardous & Glass Sorting Facility', wasteDiversionRatePct: 85.1, compostOutputKg: 120.0, recyclingPurityPct: 99.1, aiSortingMode: 'SPECTRAL_GLASS_SEPARATION' },
        { sortingUnitCode: 'SORT-UNIT-03', facilityName: 'Residential Quad Composting & Organic Plant', wasteDiversionRatePct: 94.8, compostOutputKg: 1250.0, recyclingPurityPct: 95.5, aiSortingMode: 'AI_ACCELERATED_BIO_DECOMPOSITION' },
      ];

      for (const u of defaultUnits) {
        await prisma.smartWasteSortingHub.create({
          data: { schoolId: school.id, ...u },
        });
      }

      units = await prisma.smartWasteSortingHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(units);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch waste sorting records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { sortingUnitCode, facilityName, wasteDiversionRatePct, compostOutputKg, recyclingPurityPct, aiSortingMode } = await req.json();

    if (!sortingUnitCode || !facilityName) {
      return NextResponse.json({ error: 'Sorting unit code and facility name are required' }, { status: 400 });
    }

    const unit = await prisma.smartWasteSortingHub.create({
      data: {
        schoolId: school.id,
        sortingUnitCode,
        facilityName,
        wasteDiversionRatePct: parseFloat(wasteDiversionRatePct) || 88.5,
        compostOutputKg: parseFloat(compostOutputKg) || 450.0,
        recyclingPurityPct: parseFloat(recyclingPurityPct) || 96.4,
        aiSortingMode: aiSortingMode || 'COMPUTER_VISION_POLYMER_SORT',
      },
    });

    return NextResponse.json(unit);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register sorting unit' }, { status: 500 });
  }
}
