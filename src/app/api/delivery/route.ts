export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let fleet = await prisma.deliveryFleet.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (fleet.length === 0) {
      const defaultFleet = [
        { vehicleName: 'Rover Alpha-01', vehicleType: 'ROBOT', currentBattery: 88, currentLocation: 'Science Quad to Library', status: 'IN_TRANSIT', payloadDescription: 'Lab Equipment & Reagents' },
        { vehicleName: 'SkyDrone Eagle-X', vehicleType: 'DRONE', currentBattery: 95, currentLocation: 'Administration Rooftop', status: 'DOCKING', payloadDescription: 'Urgent Medical Document Packet' },
        { vehicleName: 'Transit Buggy Beta-04', vehicleType: 'BUGGY', currentBattery: 64, currentLocation: 'Hostel Block C Courtyard', status: 'IN_TRANSIT', payloadDescription: 'Bookstore Parcel Delivery' },
      ];

      for (const item of defaultFleet) {
        await prisma.deliveryFleet.create({
          data: { schoolId: school.id, ...item },
        });
      }

      fleet = await prisma.deliveryFleet.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(fleet);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch delivery fleet' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { vehicleName, vehicleType, currentBattery, currentLocation, payloadDescription } = await req.json();

    if (!vehicleName || !payloadDescription) {
      return NextResponse.json({ error: 'Vehicle name and payload description are required' }, { status: 400 });
    }

    const vehicle = await prisma.deliveryFleet.create({
      data: {
        schoolId: school.id,
        vehicleName,
        vehicleType: vehicleType || 'ROBOT',
        currentBattery: Number(currentBattery) || 90,
        currentLocation: currentLocation || 'Central Hub',
        status: 'IN_TRANSIT',
        payloadDescription,
      },
    });

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to dispatch delivery unit' }, { status: 500 });
  }
}
