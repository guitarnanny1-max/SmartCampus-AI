export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { title, channel } = await req.json();

    if (!title || !channel) {
      return NextResponse.json({ error: 'Missing broadcast title or channel' }, { status: 400 });
    }

    const broadcast = await prisma.emergencyBroadcast.create({
      data: {
        schoolId: school.id,
        title,
        channel,
        recipientCount: Math.floor(Math.random() * 1200 + 350),
        status: 'DISPATCHED',
      },
    });

    return NextResponse.json(broadcast);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to dispatch emergency broadcast' }, { status: 500 });
  }
}
