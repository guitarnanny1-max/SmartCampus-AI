export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    let risks = await (prisma as any).studentRiskAssessment.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (risks.length === 0) {
      const defaultRisks = [
        { studentName: 'Alex Mercer', rollNo: 'CS-2026-089', riskLevel: 'HIGH', attendancePct: 62.4, cgpa: 5.4, aiReason: 'Low attendance in core modules combined with declining mid-term CGPA trajectory.' },
        { studentName: 'Jessica Taylor', rollNo: 'EE-2026-104', riskLevel: 'MEDIUM', attendancePct: 78.1, cgpa: 6.8, aiReason: 'Occasional assignment delays; stable overall performance but requires mentoring.' },
        { studentName: 'Marcus Brody', rollNo: 'ME-2026-012', riskLevel: 'LOW', attendancePct: 95.0, cgpa: 9.2, aiReason: 'Exemplary attendance and consistently top-tier academic scores.' },
      ];

      for (const r of defaultRisks) {
        await (prisma as any).studentRiskAssessment.create({
          data: { schoolId: school.id, ...r },
        });
      }

      risks = await (prisma as any).studentRiskAssessment.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(risks);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch student risk assessments' }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    const { studentName, rollNo, attendancePct, cgpa } = await req.json();

    if (!studentName || !rollNo || attendancePct === undefined || cgpa === undefined) {
      return NextResponse.json({ error: 'Student name, roll number, attendance percentage, and CGPA are required' }, { status: 400 });
    }

    let riskLevel = 'LOW';
    let aiReason = 'Student is performing exceptionally well across all tracked vectors.';

    if (attendancePct < 70 || cgpa < 6.0) {
      riskLevel = 'HIGH';
      aiReason = 'Critical alert: any and CGPA fall below institutional academic continuity threshold.';
    } else if (attendancePct < 85 || cgpa < 7.5) {
      riskLevel = 'MEDIUM';
      aiReason = 'Moderate warning: any dips in attendance or assignment submission velocity detected.';
    }

    const assessment = await (prisma as any).studentRiskAssessment.create({
      data: {
        schoolId: school.id,
        studentName,
        rollNo,
        riskLevel,
        attendancePct: parseFloat(attendancePct),
        cgpa: parseFloat(cgpa),
        aiReason,
      },
    });

    return NextResponse.json(assessment);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate student risk assessment' }, { status: 500 });
  }
}
