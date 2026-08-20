export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let sessions = await prisma.examProctoringSession.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (sessions.length === 0) {
      const defaultSessions = [
        { examTitle: 'Advanced Computer Science Midterm (CS-401)', roomNumber: 'Lab Hall 3A', totalStudents: 65, flaggedIncidentsCount: 3, aiStatus: 'ACTIVE_MONITORING', invigilatorName: 'Dr. Alan Turing' },
        { examTitle: 'Organic Chemistry Final Examination', roomNumber: 'Auditorium Block B', totalStudents: 120, flaggedIncidentsCount: 0, aiStatus: 'SECURE', invigilatorName: 'Prof. Marie Curie' },
        { examTitle: 'Macroeconomics Theory Assessment', roomNumber: 'Hall 102', totalStudents: 45, flaggedIncidentsCount: 1, aiStatus: 'REVIEW_REQUIRED', invigilatorName: 'Dr. John Keynes' },
      ];

      for (const ses of defaultSessions) {
        await prisma.examProctoringSession.create({
          data: { schoolId: school.id, ...ses },
        });
      }

      sessions = await prisma.examProctoringSession.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(sessions);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch proctoring sessions' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { examTitle, roomNumber, totalStudents, flaggedIncidentsCount, invigilatorName } = await req.json();

    if (!examTitle || !roomNumber || !invigilatorName) {
      return NextResponse.json({ error: 'Exam title, room number and invigilator are required' }, { status: 400 });
    }

    const session = await prisma.examProctoringSession.create({
      data: {
        schoolId: school.id,
        examTitle,
        roomNumber,
        totalStudents: Number(totalStudents) || 50,
        flaggedIncidentsCount: Number(flaggedIncidentsCount) || 0,
        aiStatus: 'ACTIVE_MONITORING',
        invigilatorName,
      },
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create proctoring session' }, { status: 500 });
  }
}
