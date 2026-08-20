export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let records = await prisma.smartOnboardingHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (records.length === 0) {
      const defaultRecords = [
        { stepName: 'Institution Profile & Branding Setup', roleTarget: 'ADMIN', completionStatus: 'COMPLETED', notes: 'Configured logo, custom themes, and domain.' },
        { stepName: 'AI Faculty & Department Directory Import', roleTarget: 'ADMIN', completionStatus: 'COMPLETED', notes: 'Imported 120+ faculty records via CSV.' },
        { stepName: 'Student Portal & Mobile App Provisioning', roleTarget: 'STUDENT', completionStatus: 'COMPLETED', notes: 'Generated Android & iOS app builds.' },
        { stepName: 'Virtual Classroom & Exam Proctoring Integration', roleTarget: 'FACULTY', completionStatus: 'PENDING', notes: 'Schedule first live streaming session.' },
      ];

      for (const r of defaultRecords) {
        await prisma.smartOnboardingHub.create({
          data: { schoolId: school.id, ...r },
        });
      }

      records = await prisma.smartOnboardingHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch onboarding records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { stepName, roleTarget, completionStatus, notes } = await req.json();

    if (!stepName) {
      return NextResponse.json({ error: 'Step name is required' }, { status: 400 });
    }

    const record = await prisma.smartOnboardingHub.create({
      data: {
        schoolId: school.id,
        stepName,
        roleTarget: roleTarget || 'ALL',
        completionStatus: completionStatus || 'COMPLETED',
        notes: notes || 'Step initialized through onboarding wizard.',
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create onboarding record' }, { status: 500 });
  }
}
