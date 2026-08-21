export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    let records = await (prisma as any).smartHostelHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (records.length === 0) {
      const defaultRecords = [
        { roomNumber: '101-A', hostelBlock: 'Block A - Aryabhata', studentName: 'Aarav Sharma', roomType: 'Double Sharing', messFeeInr: 45000.0, occupancyStatus: 'OCCUPIED' },
        { roomNumber: '204-B', hostelBlock: 'Block B - Ramanujan', studentName: 'Kabir Verma', roomType: 'Single Room', messFeeInr: 65000.0, occupancyStatus: 'OCCUPIED' },
        { roomNumber: '302-C', hostelBlock: 'Block C - Kalpana Chawla', studentName: 'Diya Patel', roomType: 'Double Sharing', messFeeInr: 45000.0, occupancyStatus: 'OCCUPIED' },
      ];

      for (const r of defaultRecords) {
        await (prisma as any).smartHostelHub.create({
          data: { schoolId: school.id, ...r },
        });
      }

      records = await (prisma as any).smartHostelHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch hostel records' }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    const { roomNumber, hostelBlock, studentName, roomType, messFeeInr, occupancyStatus } = await req.json();

    if (!roomNumber || !studentName) {
      return NextResponse.json({ error: 'Room number and student name are required' }, { status: 400 });
    }

    const record = await (prisma as any).smartHostelHub.create({
      data: {
        schoolId: school.id,
        roomNumber,
        hostelBlock: hostelBlock || 'Block A - Aryabhata',
        studentName,
        roomType: roomType || 'Double Sharing',
        messFeeInr: parseFloat(messFeeInr) || 45000.0,
        occupancyStatus: occupancyStatus || 'OCCUPIED',
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create hostel record' }, { status: 500 });
  }
}
