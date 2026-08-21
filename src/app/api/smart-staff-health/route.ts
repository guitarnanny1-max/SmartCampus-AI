export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    const records = await (prisma as any).smartStaffHealthHub.findMany({
      where: { schoolId: school.id },
      orderBy: { stepsToday: 'desc' },
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    const { staffName, department, stepsToday, heartRateAvg, wellnessStatus, socialMediaId, insuranceSuggestion } = await req.json();

    if (!staffName) return NextResponse.json({ error: 'Staff name required' }, { status: 400 });

    const steps = stepsToday ? parseInt(stepsToday, 10) : 7500;
    const distance = `${(steps * 0.00075).toFixed(1)} km`;

    const record = await (prisma as any).smartStaffHealthHub.create({
      data: {
        schoolId: school.id,
        staffName,
        department: department || 'General Faculty',
        stepsToday: steps,
        walkingDistanceKm: distance,
        heartRateAvg: heartRateAvg || '72 bpm',
        wellnessStatus: wellnessStatus || 'EXCELLENT',
        socialMediaId: socialMediaId || null,
        insuranceSuggestion: insuranceSuggestion || 'Standard Health Plan',
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add record' }, { status: 500 });
  }
}
