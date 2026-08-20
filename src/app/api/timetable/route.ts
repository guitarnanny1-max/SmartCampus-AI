export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let slots = await prisma.timetableSlot.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (slots.length === 0) {
      const defaultSlots = [
        { dayOfWeek: 'Monday', timeSlot: '09:00 AM - 10:30 AM', courseName: 'Advanced Artificial Intelligence', roomNumber: 'Lecture Hall A', instructor: 'Dr. Alan Turing' },
        { dayOfWeek: 'Tuesday', timeSlot: '11:00 AM - 12:30 PM', courseName: 'Data Structures & Algorithms', roomNumber: 'Lab 3B', instructor: 'Prof. Ada Lovelace' },
        { dayOfWeek: 'Wednesday', timeSlot: '02:00 PM - 03:30 PM', courseName: 'Cloud Systems Architecture', roomNumber: 'Auditorium 1', instructor: 'Dr. Grace Hopper' },
      ];

      for (const s of defaultSlots) {
        await prisma.timetableSlot.create({
          data: { schoolId: school.id, ...s },
        });
      }

      slots = await prisma.timetableSlot.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(slots);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch timetable slots' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { dayOfWeek, timeSlot, courseName, roomNumber, instructor } = await req.json();

    if (!dayOfWeek || !courseName || !roomNumber || !instructor) {
      return NextResponse.json({ error: 'Day, course name, room number, and instructor are required' }, { status: 400 });
    }

    const slot = await prisma.timetableSlot.create({
      data: {
        schoolId: school.id,
        dayOfWeek,
        timeSlot: timeSlot || '09:00 AM - 10:30 AM',
        courseName,
        roomNumber,
        instructor,
      },
    });

    return NextResponse.json(slot);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to schedule timetable slot' }, { status: 500 });
  }
}
