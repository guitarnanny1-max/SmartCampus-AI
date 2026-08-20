export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();

    let metrics = await prisma.esgMetric.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (metrics.length === 0) {
      const defaultEsg = [
        { category: 'Campus HVAC & Boiler Heating', scope: 'Scope 1 (Direct)', emissions: 142.5, reduction: 18.2 },
        { category: 'Grid Electricity Consumption', scope: 'Scope 2 (Indirect)', emissions: 88.0, reduction: 34.5 },
        { category: 'Student Commute & Supply Chain', scope: 'Scope 3 (Value Chain)', emissions: 210.3, reduction: 12.1 },
      ];

      for (const m of defaultEsg) {
        await prisma.esgMetric.create({
          data: { schoolId: school.id, ...m },
        });
      }

      metrics = await prisma.esgMetric.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(metrics);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch ESG sustainability metrics' }, { status: 500 });
  }
}
