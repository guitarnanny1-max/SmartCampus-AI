export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    let records = await (prisma as any).smartIndiaCelebrationHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (records.length === 0) {
      const defaultRecords = [
        { eventName: "Teacher's Day (Dr. S. Radhakrishnan)", celebrationDate: "September 5, 2026", category: "Academic", description: "Student-led classes, faculty felicitation, and cultural showcases.", status: "UPCOMING" },
        { eventName: "Gandhi Jayanti & Swachh Bharat Abhiyan", celebrationDate: "October 2, 2026", category: "National", description: "Campus cleanliness drive, essay competitions on non-violence.", status: "UPCOMING" },
        { eventName: "National Unity Day (Rashtriya Ekta Diwas)", celebrationDate: "October 31, 2026", category: "National", description: "Run for Unity, pledge taking ceremony for national integration.", status: "UPCOMING" },
        { eventName: "Children's Day (Pandit Nehru Birthday)", celebrationDate: "November 14, 2026", category: "Cultural", description: "Fun fairs, science exhibitions, and sports day events.", status: "UPCOMING" },
        { eventName: "Republic Day Flag Hoisting", celebrationDate: "January 26, 2027", category: "National", description: "Grand parade, march past, patriotic songs, and awards.", status: "UPCOMING" },
        { eventName: "National Science Day", celebrationDate: "February 28, 2027", category: "Academic", description: "Science project exhibitions honoring Sir C.V. Raman.", status: "UPCOMING" },
        { eventName: "International Yoga Day", celebrationDate: "June 21, 2027", category: "Cultural", description: "Mass yoga demonstration and wellness lecture in school courtyard.", status: "UPCOMING" },
        { eventName: "Independence Day Celebrations", celebrationDate: "August 15, 2027", category: "National", description: "Tricolor flag hoisting, cultural dances, and freedom fighter tributes.", status: "UPCOMING" },
      ];

      for (const r of defaultRecords) {
        await (prisma as any).smartIndiaCelebrationHub.create({
          data: { schoolId: school.id, ...r },
        });
      }

      records = await (prisma as any).smartIndiaCelebrationHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch India celebration reminders' }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    const { eventName, celebrationDate, category, description } = await req.json();

    if (!eventName || !celebrationDate) {
      return NextResponse.json({ error: 'Event name and date are required' }, { status: 400 });
    }

    const record = await (prisma as any).smartIndiaCelebrationHub.create({
      data: {
        schoolId: school.id,
        eventName,
        celebrationDate,
        category: category || 'National',
        description: description || 'Special school assembly and commemorative activities.',
        status: 'UPCOMING',
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create celebration reminder' }, { status: 500 });
  }
}
