export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    let applications = await (prisma as any).scholarshipApplication.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (applications.length === 0) {
      const defaultApps = [
        { studentName: 'Katherine Johnson', rollNo: 'CS-2024-001', scholarshipName: 'Presidential Merit Scholarship', fundCategory: 'MERIT_BASED', amountRequested: 15000.0, status: 'APPROVED' },
        { studentName: 'James Clerk Maxwell', rollNo: 'PH-2024-045', scholarshipName: 'Alumni STEM Grant', fundCategory: 'DEPARTMENTAL', amountRequested: 5000.0, status: 'PENDING_REVIEW' },
        { studentName: 'Marie Curie', rollNo: 'CH-2025-012', scholarshipName: 'Global Diversity Fund', fundCategory: 'NEED_BASED', amountRequested: 12000.0, status: 'DISBURSED' },
      ];

      for (const app of defaultApps) {
        await (prisma as any).scholarshipApplication.create({
          data: { schoolId: school.id, ...app },
        });
      }

      applications = await (prisma as any).scholarshipApplication.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(applications);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch scholarship applications' }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    const { studentName, rollNo, scholarshipName, fundCategory, amountRequested } = await req.json();

    if (!studentName || !rollNo || !scholarshipName || !amountRequested) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const application = await (prisma as any).scholarshipApplication.create({
      data: {
        schoolId: school.id,
        studentName,
        rollNo,
        scholarshipName,
        fundCategory: fundCategory || 'MERIT_BASED',
        amountRequested: parseFloat(amountRequested),
        status: 'PENDING_REVIEW',
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to submit scholarship application' }, { status: 500 });
  }
}
