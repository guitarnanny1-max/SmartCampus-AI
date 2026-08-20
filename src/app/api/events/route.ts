export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let events = await prisma.eventClub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (events.length === 0) {
      const defaultEvents = [
        { eventName: 'TechnoHack 2026 Annual Hackathon', clubName: 'Google Developer Student Club', venue: 'Main Auditorium & Labs', eventDate: '2026-04-15', budget: 5000.00, status: 'APPROVED' },
        { eventName: 'Annual Cultural Fest: Symphony', clubName: 'Music & Arts Society', venue: 'Open Air Theatre', eventDate: '2026-05-02', budget: 12500.00, status: 'APPROVED' },
        { eventName: 'RoboWars National Championship', clubName: 'Robotics & Mechatronics Club', venue: 'Indoor Sports Complex', eventDate: '2026-05-20', budget: 3500.00, status: 'PENDING' },
      ];

      for (const e of defaultEvents) {
        await prisma.eventClub.create({
          data: { schoolId: school.id, ...e },
        });
      }

      events = await prisma.eventClub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(events);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch campus events' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { eventName, clubName, venue, eventDate, budget } = await req.json();

    if (!eventName || !clubName || !venue || !eventDate || budget === undefined) {
      return NextResponse.json({ error: 'All event fields are required' }, { status: 400 });
    }

    const event = await prisma.eventClub.create({
      data: {
        schoolId: school.id,
        eventName,
        clubName,
        venue,
        eventDate,
        budget: parseFloat(budget),
        status: 'APPROVED',
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
