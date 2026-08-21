export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    let resumes = await (prisma as any).smartStudentResume.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (resumes.length === 0) {
      const defaultResumes = [
        { studentName: 'Aditya Deshmukh', rollNumber: 'SC-2026-101', targetRole: 'Software Engineer (L3)', gpa: 9.2, skills: 'TypeScript, React, Node.js, Python, PostgreSQL', projects: 'Autonomous Campus Drone Fleet Telemetry & IoT Mesh', atsScore: 96.8 },
        { studentName: 'Ananya Iyer', rollNumber: 'SC-2026-102', targetRole: 'AI/ML Research Engineer', gpa: 9.5, skills: 'PyTorch, TensorFlow, LLMs, Vector DBs, FastAPI', projects: 'Real-time AI Proctoring & Biometric Face Recognition System', atsScore: 98.2 },
      ];

      for (const r of defaultResumes) {
        await (prisma as any).smartStudentResume.create({
          data: { schoolId: school.id, ...r },
        });
      }

      resumes = await (prisma as any).smartStudentResume.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(resumes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch student resumes' }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    const { studentName, rollNumber, targetRole, gpa, skills, projects } = await req.json();

    if (!studentName || !rollNumber || !targetRole) {
      return NextResponse.json({ error: 'Student name, roll number, and target role are required' }, { status: 400 });
    }

    // Simulate AI ATS score calculation based on skills and GPA length
    const calculatedAtsScore = Math.min(99.5, 85.0 + (parseFloat(gpa) || 8.0) * 1.2);

    const resume = await (prisma as any).smartStudentResume.create({
      data: {
        schoolId: school.id,
        studentName,
        rollNumber,
        targetRole,
        gpa: parseFloat(gpa) || 8.5,
        skills: skills || 'React, TypeScript, Python',
        projects: projects || 'Enterprise Campus Operating System',
        atsScore: parseFloat(calculatedAtsScore.toFixed(1)),
      },
    });

    return NextResponse.json(resume);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create student resume' }, { status: 500 });
  }
}
