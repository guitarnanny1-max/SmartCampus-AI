export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch all schools and their related activity records
    const schools = await prisma.school.findMany({
      include: {
        smartStaffHealthHubs: true,
        smartLmsOpenSources: true,
      },
    });

    // Calculate utilization scores
    const utilizationData = schools.map(school => {
      const healthActivity = school.smartStaffHealthHubs.length;
      const lmsActivity = school.smartLmsOpenSources.length;
      const totalScore = (healthActivity * 2) + (lmsActivity * 5); // Weighting: LMS integration is "worth" more

      return {
        id: school.id,
        name: school.name || "Unnamed Institution",
        healthActivity,
        lmsActivity,
        totalScore,
      };
    }).sort((a, b) => b.totalScore - a.totalScore);

    return NextResponse.json(utilizationData);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to aggregate platform utilization data' }, { status: 500 });
  }
}
