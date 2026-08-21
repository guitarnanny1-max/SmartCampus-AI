export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    // Fetch all schools and their related activity records
    const schools = await (prisma as any).school.findMany({
      include: {
        smartStaffHealthHubs: true,
        smartLmsOpenSources: true,
      },
    });

    // Calculate utilization scores
    const utilizationData = schools.map((school: any) => {
      const healthActivity = school.smartStaffHealthHubs.length;
      const lmsActivity = school.smartLmsOpenSources.length;
      const totalScore = (healthActivity * 2) + (lmsActivity * 5); // Weighting: any integration is "worth" more

      return {
        id: school.id,
        name: school.name || "Unnamed Institution",
        healthActivity,
        lmsActivity,
        totalScore,
      };
    }).sort((a: any, b: any) => b.totalScore - a.totalScore);

    return NextResponse.json(utilizationData);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to aggregate platform utilization data' }, { status: 500 });
  }
}
