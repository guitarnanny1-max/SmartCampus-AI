export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { subject, category, priority, submittedBy } = await req.json();

    if (!subject || !category) {
      return NextResponse.json({ error: 'Subject and category are required' }, { status: 400 });
    }

    const ticket = await prisma.ticket.create({
      data: {
        schoolId: school.id,
        subject,
        category,
        priority: priority || 'MEDIUM',
        status: 'OPEN',
        submittedBy: submittedBy || 'Facility Operator',
      },
    });

    return NextResponse.json(ticket);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create maintenance ticket' }, { status: 500 });
  }
}
