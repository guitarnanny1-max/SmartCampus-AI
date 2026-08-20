export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let bins = await prisma.smartWasteBin.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (bins.length === 0) {
      const defaultBins = [
        { binCode: 'BIN-CENTRAL-01', zoneName: 'Student Union Quad', wasteCategory: 'RECYCLABLE_PLASTIC', fillLevelPct: 78, compactedCount: 24, status: 'ACTIVE' },
        { binCode: 'BIN-LIBRARY-04', zoneName: 'Library Learning Commons', wasteCategory: 'PAPER_CARDBOARD', fillLevelPct: 91, compactedCount: 45, status: 'NEEDS_COLLECTION' },
        { binCode: 'BIN-CAFETERIA-02', zoneName: 'Dining Hall South', wasteCategory: 'ORGANIC_COMPOST', fillLevelPct: 65, compactedCount: 18, status: 'ACTIVE' },
      ];

      for (const b of defaultBins) {
        await prisma.smartWasteBin.create({
          data: { schoolId: school.id, ...b },
        });
      }

      bins = await prisma.smartWasteBin.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(bins);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch waste bins' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { binCode, zoneName, wasteCategory, fillLevelPct, compactedCount, status } = await req.json();

    if (!binCode || !zoneName || !wasteCategory) {
      return NextResponse.json({ error: 'Bin code, zone name and waste category are required' }, { status: 400 });
    }

    const bin = await prisma.smartWasteBin.create({
      data: {
        schoolId: school.id,
        binCode,
        zoneName,
        wasteCategory,
        fillLevelPct: parseInt(fillLevelPct) || 30,
        compactedCount: parseInt(compactedCount) || 5,
        status: status || 'ACTIVE',
      },
    });

    return NextResponse.json(bin);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create waste bin' }, { status: 500 });
  }
}
