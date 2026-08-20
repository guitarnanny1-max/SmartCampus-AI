export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let endowments = await prisma.alumniEndowment.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (endowments.length === 0) {
      const defaultEndowments = [
        { donorName: 'Dr. Marcus Vance (Google VP)', gradYear: 2012, amount: 250000, campaign: 'AI & Robotics Research Lab Fund' },
        { donorName: 'Elena Rostova (Stripe Director)', gradYear: 2015, amount: 100000, campaign: 'Underprivileged Student Scholarship' },
        { donorName: 'David Sterling (Y Combinator Partner)', gradYear: 2010, amount: 500000, campaign: 'Campus Solar Microgrid Endowment' },
      ];

      for (const d of defaultEndowments) {
        await prisma.alumniEndowment.create({
          data: { schoolId: school.id, ...d },
        });
      }

      endowments = await prisma.alumniEndowment.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(endowments);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch alumni endowments' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { donorName, gradYear, amount, campaign } = await req.json();

    if (!donorName || !gradYear || !amount || !campaign) {
      return NextResponse.json({ error: 'Donor name, graduation year, amount, and campaign are required' }, { status: 400 });
    }

    const endowment = await prisma.alumniEndowment.create({
      data: {
        schoolId: school.id,
        donorName,
        gradYear: parseInt(gradYear),
        amount: parseFloat(amount),
        campaign,
      },
    });

    return NextResponse.json(endowment);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to record alumni contribution' }, { status: 500 });
  }
}
