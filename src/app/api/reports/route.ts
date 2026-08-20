export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let reports = await prisma.auditReport.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (reports.length === 0) {
      const defaultReports = [
        { title: 'Q2 2026 Comprehensive Sustainability & ESG Audit', category: 'ESG & Carbon', generatedBy: 'Dr. Arthur Vance' },
        { title: 'Annual Multi-Tenant Security & RBAC Compliance Report', category: 'Security & Access', generatedBy: 'System Administrator' },
        { title: 'IoT Infrastructure & Solar Grid Efficiency Assessment', category: 'Facilities', generatedBy: 'Facilities Director' },
      ];

      for (const r of defaultReports) {
        await prisma.auditReport.create({
          data: { schoolId: school.id, ...r },
        });
      }

      reports = await prisma.auditReport.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(reports);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch audit reports' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { title, category } = await req.json();

    if (!title || !category) {
      return NextResponse.json({ error: 'Title and category are required' }, { status: 400 });
    }

    const report = await prisma.auditReport.create({
      data: {
        schoolId: school.id,
        title,
        category,
        generatedBy: 'Platform Administrator',
      },
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate audit report' }, { status: 500 });
  }
}
