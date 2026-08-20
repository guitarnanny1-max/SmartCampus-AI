export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let permits = await prisma.parkingPermit.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (permits.length === 0) {
      const defaultPermits = [
        { ownerName: 'Prof. Arthur Pendelton', vehicleNo: 'CA-998-XYZ', permitType: 'FACULTY', slotNo: 'F-102', status: 'ACTIVE' },
        { ownerName: 'Alex Mercer (Student)', vehicleNo: 'NY-452-ABC', permitType: 'STUDENT', slotNo: 'S-305', status: 'ACTIVE' },
        { ownerName: 'Dr. Rebecca Vance', vehicleNo: 'TX-771-MNO', permitType: 'FACULTY', slotNo: 'F-108', status: 'ACTIVE' },
      ];

      for (const p of defaultPermits) {
        await prisma.parkingPermit.create({
          data: { schoolId: school.id, ...p },
        });
      }

      permits = await prisma.parkingPermit.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(permits);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch parking permits' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { ownerName, vehicleNo, permitType, slotNo, status } = await req.json();

    if (!ownerName || !vehicleNo || !slotNo) {
      return NextResponse.json({ error: 'Owner name, vehicle number, and slot number are required' }, { status: 400 });
    }

    const permit = await prisma.parkingPermit.create({
      data: {
        schoolId: school.id,
        ownerName,
        vehicleNo,
        permitType: permitType || 'STUDENT',
        slotNo,
        status: status || 'ACTIVE',
      },
    });

    return NextResponse.json(permit);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create parking permit' }, { status: 500 });
  }
}
