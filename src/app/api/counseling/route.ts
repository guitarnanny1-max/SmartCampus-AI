export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let sessions = await prisma.counselingSession.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (sessions.length === 0) {
      const defaultSessions = [
        { studentName: 'Alex Mercer', counselorName: 'Dr. Evelyn Vance, PsyD', issueCategory: 'ACADEMIC_STRESS', status: 'SCHEDULED', sessionDate: '2026-08-20 14:00' },
        { studentName: 'Elena Rostova', counselorName: 'Mark Sterling, LCSW', issueCategory: 'ANXIETY_MANAGEMENT', status: 'COMPLETED', sessionDate: '2026-08-15 10:30' },
        { studentName: 'Jordan Lee', counselorName: 'Dr. Evelyn Vance, PsyD', issueCategory: 'CAREER_BURNOUT', status: 'CONFIRMED', sessionDate: '2026-08-22 16:00' },
      ];

      for (const s of defaultSessions) {
        await prisma.counselingSession.create({
          data: { schoolId: school.id, ...s },
        });
      }

      sessions = await prisma.counselingSession.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(sessions);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch counseling sessions' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { studentName, counselorName, issueCategory, sessionDate } = await req.json();

    if (!studentName || !counselorName || !sessionDate) {
      return NextResponse.json({ error: 'Student name, counselor name, and session date are required' }, { status: 400 });
    }

    const session = await prisma.counselingSession.create({
      data: {
        schoolId: school.id,
        studentName,
        counselorName,
        issueCategory: issueCategory || 'ACADEMIC_STRESS',
        status: 'SCHEDULED',
        sessionDate,
      },
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to schedule counseling session' }, { status: 500 });
  }
}
