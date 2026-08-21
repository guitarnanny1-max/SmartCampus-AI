export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    let lockers = await (prisma as any).smartLockerDelivery.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (lockers.length === 0) {
      const defaultLockers = [
        { lockerBank: 'BANK-DORM-A', lockerNumber: 'L-104', recipientName: 'Alex Rivera', carrierName: 'CAMPUS_ROBOT_ALPHA', status: 'STORED', retrievalPin: '8291' },
        { lockerBank: 'BANK-CENTRAL-01', lockerNumber: 'L-212', recipientName: 'Dr. Evelyn Vance', carrierName: 'FEDEX_EXPRESS', status: 'STORED', retrievalPin: '3942' },
        { lockerBank: 'BANK-DORM-B', lockerNumber: 'L-008', recipientName: 'Marcus Brody', carrierName: 'AMAZON_LOGISTICS', status: 'COLLECTED', retrievalPin: '1024' },
      ];

      for (const l of defaultLockers) {
        await (prisma as any).smartLockerDelivery.create({
          data: { schoolId: school.id, ...l },
        });
      }

      lockers = await (prisma as any).smartLockerDelivery.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(lockers);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch smart locker deliveries' }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    const { lockerBank, lockerNumber, recipientName, carrierName, status, retrievalPin } = await req.json();

    if (!lockerBank || !recipientName) {
      return NextResponse.json({ error: 'Locker bank and recipient name are required' }, { status: 400 });
    }

    const locker = await (prisma as any).smartLockerDelivery.create({
      data: {
        schoolId: school.id,
        lockerBank,
        lockerNumber: lockerNumber || 'L-101',
        recipientName,
        carrierName: carrierName || 'CAMPUS_ROBOT',
        status: status || 'STORED',
        retrievalPin: retrievalPin || Math.floor(1000 + Math.random() * 9000).toString(),
      },
    });

    return NextResponse.json(locker);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register locker parcel' }, { status: 500 });
  }
}
