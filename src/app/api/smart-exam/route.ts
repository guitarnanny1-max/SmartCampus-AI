export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let records = await prisma.smartExamHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (records.length === 0) {
      const defaultRecords = [
        { examTitle: 'Artificial Intelligence Mid-Term Assessment', courseName: 'CS-401 AI & Neural Networks', totalMarks: 100, proctoringMode: 'AI Proctored', examStatus: 'SCHEDULED' },
        { examTitle: 'Data Structures & Algorithms Final', courseName: 'CS-202 Core DSA', totalMarks: 150, proctoringMode: 'AI Proctored', examStatus: 'LIVE' },
        { examTitle: 'VLSI Design & Embedded Systems', courseName: 'ECE-305 Hardware', totalMarks: 100, proctoringMode: 'Open Book', examStatus: 'COMPLETED' },
      ];

      for (const r of defaultRecords) {
        await prisma.smartExamHub.create({
          data: { schoolId: school.id, ...r },
        });
      }

      records = await prisma.smartExamHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch exam records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { examTitle, courseName, totalMarks, proctoringMode, examStatus } = await req.json();

    if (!examTitle || !courseName) {
      return NextResponse.json({ error: 'Exam title and course name are required' }, { status: 400 });
    }

    const record = await prisma.smartExamHub.create({
      data: {
        schoolId: school.id,
        examTitle,
        courseName,
        totalMarks: parseInt(totalMarks) || 100,
        proctoringMode: proctoringMode || 'AI Proctored',
        examStatus: examStatus || 'SCHEDULED',
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create examination record' }, { status: 500 });
  }
}
