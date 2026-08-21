export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    let records = await (prisma as any).smartIdCardHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (records.length === 0) {
      const defaultRecords = [
        { cardholderName: 'Aarav Sharma', role: 'STUDENT', department: 'Computer Science & Engineering', rollOrEmpId: 'SC-2026-001', validThru: '2030-06-30', idStatus: 'ACTIVE' },
        { cardholderName: 'Dr. Rameshwar Nathan', role: 'FACULTY', department: 'Artificial Intelligence & Robotics', rollOrEmpId: 'FAC-2026-012', validThru: '2032-06-30', idStatus: 'ACTIVE' },
        { cardholderName: 'Diya Patel', role: 'STUDENT', department: 'Electronics & Communication', rollOrEmpId: 'SC-2026-002', validThru: '2030-06-30', idStatus: 'ACTIVE' },
      ];

      for (const r of defaultRecords) {
        await (prisma as any).smartIdCardHub.create({
          data: { schoolId: school.id, ...r },
        });
      }

      records = await (prisma as any).smartIdCardHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch ID card records' }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    const { cardholderName, role, department, rollOrEmpId, validThru, idStatus } = await req.json();

    if (!cardholderName || !rollOrEmpId) {
      return NextResponse.json({ error: 'Cardholder name and ID/Roll number are required' }, { status: 400 });
    }

    const record = await (prisma as any).smartIdCardHub.create({
      data: {
        schoolId: school.id,
        cardholderName,
        role: role || 'STUDENT',
        department: department || 'General Engineering',
        rollOrEmpId,
        validThru: validThru || '2028-06-30',
        idStatus: idStatus || 'ACTIVE',
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create ID card record' }, { status: 500 });
  }
}
