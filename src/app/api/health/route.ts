export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let records = await prisma.medicalRecord.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (records.length === 0) {
      const defaultRecords = [
        { studentName: 'Alex Mercer', rollNo: 'CS-2026-089', symptoms: 'Migraine and High Fever', diagnosis: 'Viral Upper Respiratory Infection', doctorName: 'Dr. Sarah Connor, MD', status: 'TREATED' },
        { studentName: 'Elena Rostova', rollNo: 'EE-2026-102', symptoms: 'Sprained Ankle during Basketball', diagnosis: 'Grade 1 Lateral Ligament Sprain', doctorName: 'Dr. John Watson, Orthopedics', status: 'OBSERVATION' },
      ];

      for (const r of defaultRecords) {
        await prisma.medicalRecord.create({
          data: { schoolId: school.id, ...r },
        });
      }

      records = await prisma.medicalRecord.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch medical records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { studentName, rollNo, symptoms, diagnosis, doctorName, status } = await req.json();

    if (!studentName || !rollNo || !symptoms || !diagnosis || !doctorName) {
      return NextResponse.json({ error: 'All primary medical fields are required' }, { status: 400 });
    }

    const record = await prisma.medicalRecord.create({
      data: {
        schoolId: school.id,
        studentName,
        rollNo,
        symptoms,
        diagnosis,
        doctorName,
        status: status || 'TREATED',
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to record medical visit' }, { status: 500 });
  }
}
