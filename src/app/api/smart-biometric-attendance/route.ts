export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    let records = await (prisma as any).smartBiometricAttendanceHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (records.length === 0) {
      const defaultRecords = [
        { studentOrFacultyName: 'Dr. Rameshwar Nathan', roleType: 'FACULTY', biometricDeviceCode: 'BIO-GATE-NORTH-01', attendanceStatus: 'PRESENT' },
        { studentOrFacultyName: 'Priya Swaminathan', roleType: 'STUDENT', biometricDeviceCode: 'BIO-GATE-MAIN-02', attendanceStatus: 'PRESENT' },
        { studentOrFacultyName: 'Karan Malhotra', roleType: 'STUDENT', biometricDeviceCode: 'BIO-GATE-MAIN-02', attendanceStatus: 'LATE' },
      ];

      for (const r of defaultRecords) {
        await (prisma as any).smartBiometricAttendanceHub.create({
          data: { schoolId: school.id, ...r },
        } as any);
      }

      records = await (prisma as any).smartBiometricAttendanceHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch biometric attendance records' }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    const { studentOrFacultyName, roleType, biometricDeviceCode, attendanceStatus } = await req.json();

    if (!studentOrFacultyName || !biometricDeviceCode) {
      return NextResponse.json({ error: 'Name and biometric device code are required' }, { status: 400 });
    }

    const record = await (prisma as any).smartBiometricAttendanceHub.create({
      data: {
        schoolId: school.id,
        studentOrFacultyName,
        roleType: roleType || 'STUDENT',
        biometricDeviceCode,
        attendanceStatus: attendanceStatus || 'PRESENT',
      },
    } as any);

    return NextResponse.json(record);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to record biometric attendance' }, { status: 500 });
  }
}
