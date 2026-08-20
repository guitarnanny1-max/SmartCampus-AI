export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let placements = await prisma.smartCareerPlacementHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (placements.length === 0) {
      const defaultPlacements = [
        { studentName: 'Aarav Sharma', degreeMajor: 'B.Tech Artificial Intelligence & Robotics', corporatePartner: 'OpenAI Research Labs', salaryOfferUsd: 210000.0, aiInterviewScore: 98.4, placementStatus: 'PLACED' },
        { studentName: 'Priya Nair', degreeMajor: 'M.Sc Quantum Computing & Physics', corporatePartner: 'IBM Quantum Systems', salaryOfferUsd: 195000.0, aiInterviewScore: 97.2, placementStatus: 'PLACED' },
        { studentName: 'Rohan Verma', degreeMajor: 'B.Tech Aerospace & Satellite Systems', corporatePartner: 'SpaceX Propulsion Engineering', salaryOfferUsd: 185000.0, aiInterviewScore: 95.8, placementStatus: 'OFFER_PENDING' },
      ];

      for (const p of defaultPlacements) {
        await prisma.smartCareerPlacementHub.create({
          data: { schoolId: school.id, ...p },
        });
      }

      placements = await prisma.smartCareerPlacementHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(placements);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch career placement records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { studentName, degreeMajor, corporatePartner, salaryOfferUsd, aiInterviewScore, placementStatus } = await req.json();

    if (!studentName || !corporatePartner) {
      return NextResponse.json({ error: 'Student name and corporate partner are required' }, { status: 400 });
    }

    const placement = await prisma.smartCareerPlacementHub.create({
      data: {
        schoolId: school.id,
        studentName,
        degreeMajor: degreeMajor || 'B.Tech Computer Science & Engineering',
        corporatePartner,
        salaryOfferUsd: parseFloat(salaryOfferUsd) || 150000.0,
        aiInterviewScore: parseFloat(aiInterviewScore) || 95.0,
        placementStatus: placementStatus || 'PLACED',
      },
    });

    return NextResponse.json(placement);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create career placement record' }, { status: 500 });
  }
}
