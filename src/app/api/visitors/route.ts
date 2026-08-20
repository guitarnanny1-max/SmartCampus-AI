export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let visitors = await prisma.visitorLog.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (visitors.length === 0) {
      const defaultVisitors = [
        { visitorName: 'Dr. Evelyn Reed', hostName: 'Dean of Research', purpose: 'Keynote Lecture & Lab Inspection', badgeNo: 'VIS-9021' },
        { visitorName: 'Mark Sterling', hostName: 'Facilities Director', purpose: 'HVAC Chiller Maintenance Audit', badgeNo: 'VIS-9022' },
      ];

      for (const v of defaultVisitors) {
        await prisma.visitorLog.create({
          data: { schoolId: school.id, ...v },
        });
      }

      visitors = await prisma.visitorLog.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(visitors);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch visitor logs' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { visitorName, hostName, purpose, badgeNo } = await req.json();

    if (!visitorName || !hostName || !badgeNo) {
      return NextResponse.json({ error: 'Visitor name, host name, and badge number are required' }, { status: 400 });
    }

    const visitor = await prisma.visitorLog.create({
      data: {
        schoolId: school.id,
        visitorName,
        hostName,
        purpose: purpose || 'General Visit',
        badgeNo,
        status: 'CHECKED_IN',
      },
    });

    return NextResponse.json(visitor);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to check in visitor' }, { status: 500 });
  }
}
