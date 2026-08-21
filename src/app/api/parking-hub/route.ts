export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    let bays = await (prisma as any).smartParkingBay.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (bays.length === 0) {
      const defaultBays = [
        { bayNo: 'EV-01', zoneName: 'Science Quad Solar Bay', isEvCharging: true, status: 'OCCUPIED', vehicleNumber: 'KA-01-EV-9988' },
        { bayNo: 'EV-02', zoneName: 'Science Quad Solar Bay', isEvCharging: true, status: 'AVAILABLE', vehicleNumber: null },
        { bayNo: 'PK-104', zoneName: 'Main Administration Lot', isEvCharging: false, status: 'OCCUPIED', vehicleNumber: 'DL-3C-4421' },
        { bayNo: 'PK-105', zoneName: 'Main Administration Lot', isEvCharging: false, status: 'AVAILABLE', vehicleNumber: null },
      ];

      for (const bay of defaultBays) {
        await (prisma as any).smartParkingBay.create({
          data: { schoolId: school.id, ...bay },
        });
      }

      bays = await (prisma as any).smartParkingBay.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(bays);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch parking bays' }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    const { bayNo, zoneName, isEvCharging, status, vehicleNumber } = await req.json();

    if (!bayNo || !zoneName) {
      return NextResponse.json({ error: 'Bay number and zone name are required' }, { status: 400 });
    }

    const bay = await (prisma as any).smartParkingBay.create({
      data: {
        schoolId: school.id,
        bayNo,
        zoneName,
        isEvCharging: Boolean(isEvCharging),
        status: status || 'AVAILABLE',
        vehicleNumber: vehicleNumber || null,
      },
    });

    return NextResponse.json(bay);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create parking bay' }, { status: 500 });
  }
}
