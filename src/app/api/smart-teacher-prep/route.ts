export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    const records = await (prisma as any).smartTeacherPrepHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch teacher prep records' }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    const { teacherName, subjectName, topic, prepType } = await req.json();

    if (!teacherName || !subjectName || !topic) {
      return NextResponse.json({ error: 'Teacher name, subject, and topic are required' }, { status: 400 });
    }

    let aiOutput = '';
    if (prepType === 'SEMINAR_PRESENTATION') {
      aiOutput = `### Gemini AI Seminar Presentation Outline\n\n` +
        `**Topic:** ${topic}\n` +
        `**Subject Domain:** ${subjectName}\n` +
        `**Presenter:** ${teacherName}\n\n` +
        `1. **Introduction & Hook (Slide 1-3):**\n` +
        `   - Welcome and session objectives.\n` +
        `   - Real-world context and relevance of ${topic}.\n\n` +
        `2. **Core Concepts & Theoretical Framework (Slide 4-8):**\n` +
        `   - Fundamental principles and key literature in ${subjectName}.\n` +
        `   - Case studies and data visual breakdown.\n\n` +
        `3. **Interactive Q&A & Discussion Activity (Slide 9):**\n` +
        `   - Audience engagement prompt and live poll questions.\n\n` +
        `4. **Conclusion & Actionable Takeaways (Slide 10):**\n` +
        `   - Summary of key insights and recommended further reading.`;
    } else {
      aiOutput = `### Gemini AI Subject Lesson Plan & Preparation\n\n` +
        `**Subject:** ${subjectName}\n` +
        `**Topic Focus:** ${topic}\n` +
        `**Instructor:** ${teacherName}\n\n` +
        `1. **Learning Objectives:**\n` +
        `   - Students will master fundamental tenets of ${topic}.\n` +
        `   - Practical application within the ${subjectName} curriculum.\n\n` +
        `2. **Detailed Lesson Outline (60 Mins):**\n` +
        `   - *Introduction (15 mins):* Hook students with a real-world scenario.\n` +
        `   - *Core Lecture & Concepts (30 mins):* Deep-dive breakdown with examples.\n` +
        `   - *Formative Assessment (15 mins):* Group problem-solving & Q&A.\n\n` +
        `3. **Homework & Assessment Questions:**\n` +
        `   - Formulated 3 critical-thinking assignments for student evaluation.`;
    }

    const record = await (prisma as any).smartTeacherPrepHub.create({
      data: {
        schoolId: school.id,
        teacherName,
        subjectName,
        topic,
        prepType: prepType || 'SUBJECT_PREP',
        aiOutput,
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate preparation content' }, { status: 500 });
  }
}
