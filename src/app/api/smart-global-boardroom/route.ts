export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let regions = await prisma.smartGlobalBoardroomHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (regions.length === 0) {
      const defaultRegions = [
        { regionCode: 'NA-EAST-01', regionName: 'North American Flagship Campus (Boston)', totalEnrolledStudents: 24500, treasuryRevenueUsd: 42000000.0, aiComputeEfficiencyPercent: 99.1, boardroomStatus: 'GLOBAL_SYNC' },
        { regionCode: 'EU-CENT-02', regionName: 'European Research & Tech Hub (Zurich)', totalEnrolledStudents: 18200, treasuryRevenueUsd: 31500000.0, aiComputeEfficiencyPercent: 98.7, boardroomStatus: 'OPTIMIZING' },
        { regionCode: 'APAC-IND-03', regionName: 'Asia-Pacific Quantum & Medical Campus (Hyderabad)', totalEnrolledStudents: 31000, treasuryRevenueUsd: 28400000.0, aiComputeEfficiencyPercent: 99.5, boardroomStatus: 'GLOBAL_SYNC' },
      ];

      for (const r of defaultRegions) {
        await prisma.smartGlobalBoardroomHub.create({
          data: { schoolId: school.id, ...r },
        });
      }

      regions = await prisma.smartGlobalBoardroomHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(regions);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch global boardroom records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { regionCode, regionName, totalEnrolledStudents, treasuryRevenueUsd, aiComputeEfficiencyPercent, boardroomStatus } = await req.json();

    if (!regionCode || !regionName) {
      return NextResponse.json({ error: 'Region code and name are required' }, { status: 400 });
    }

    const region = await prisma.smartGlobalBoardroomHub.create({
      data: {
        schoolId: school.id,
        regionCode,
        regionName,
        totalEnrolledStudents: parseInt(totalEnrolledStudents) || 12500,
        treasuryRevenueUsd: parseFloat(treasuryRevenueUsd) || 15000000.0,
        aiComputeEfficiencyPercent: parseFloat(aiComputeEfficiencyPercent) || 98.0,
        boardroomStatus: boardroomStatus || 'GLOBAL_SYNC',
      },
    });

    return NextResponse.json(region);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create global boardroom region' }, { status: 500 });
  }
}
