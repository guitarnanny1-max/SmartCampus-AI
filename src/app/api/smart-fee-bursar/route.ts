export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let records = await prisma.smartFeeBursarHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (records.length === 0) {
      const defaultRecords = [
        { studentName: 'Aarav Sharma', rollNumber: 'SC-2026-001', tuitionAmountInr: 150000.0, scholarshipInr: 30000.0, paymentStatus: 'PAID' },
        { studentName: 'Diya Patel', rollNumber: 'SC-2026-002', tuitionAmountInr: 180000.0, scholarshipInr: 45000.0, paymentStatus: 'PAID' },
        { studentName: 'Kabir Verma', rollNumber: 'SC-2026-003', tuitionAmountInr: 135000.0, scholarshipInr: 0.0, paymentStatus: 'PENDING' },
      ];

      for (const r of defaultRecords) {
        await prisma.smartFeeBursarHub.create({
          data: { schoolId: school.id, ...r },
        });
      }

      records = await prisma.smartFeeBursarHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch fee bursar records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { studentName, rollNumber, tuitionAmountInr, scholarshipInr, paymentStatus } = await req.json();

    if (!studentName || !rollNumber) {
      return NextResponse.json({ error: 'Student name and roll number are required' }, { status: 400 });
    }

    const record = await prisma.smartFeeBursarHub.create({
      data: {
        schoolId: school.id,
        studentName,
        rollNumber,
        tuitionAmountInr: parseFloat(tuitionAmountInr) || 120000.0,
        scholarshipInr: parseFloat(scholarshipInr) || 0.0,
        paymentStatus: paymentStatus || 'PAID',
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create fee bursar record' }, { status: 500 });
  }
}
