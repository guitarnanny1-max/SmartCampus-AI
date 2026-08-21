export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    let records = await (prisma as any).smartAiTutorProctorHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (records.length === 0) {
      const defaultRecords = [
        { studentName: 'Karan Malhotra', courseTitle: 'Advanced Neural Network Architectures', aiQueryPrompt: 'Explain transformer self-attention mathematical formulation.', proctorStatus: 'VERIFIED', confidenceScore: 99.8 },
        { studentName: 'Sneha Reddy', courseTitle: 'Quantum Cryptography & Lattice Codes', aiQueryPrompt: 'Derive Shor algorithm polynomial runtime complexity.', proctorStatus: 'VERIFIED', confidenceScore: 99.4 },
        { studentName: 'Vikram Singh', courseTitle: 'Autonomous Robotics Control Systems', aiQueryPrompt: 'Troubleshoot Kalman filter sensor fusion drift.', proctorStatus: 'FLAGGED', confidenceScore: 84.2 },
      ];

      for (const r of defaultRecords) {
        await (prisma as any).smartAiTutorProctorHub.create({
          data: { schoolId: school.id, ...r },
        });
      }

      records = await (prisma as any).smartAiTutorProctorHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch AI tutor records' }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    const { studentName, courseTitle, aiQueryPrompt, proctorStatus, confidenceScore } = await req.json();

    if (!studentName || !aiQueryPrompt) {
      return NextResponse.json({ error: 'Student name and query prompt are required' }, { status: 400 });
    }

    const record = await (prisma as any).smartAiTutorProctorHub.create({
      data: {
        schoolId: school.id,
        studentName,
        courseTitle: courseTitle || 'General AI Curriculum',
        aiQueryPrompt,
        proctorStatus: proctorStatus || 'VERIFIED',
        confidenceScore: parseFloat(confidenceScore) || 98.5,
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create AI tutor record' }, { status: 500 });
  }
}
