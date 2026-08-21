export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    let equipment = await (prisma as any).labEquipment.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (equipment.length === 0) {
      const defaultEquipment = [
        { name: 'Scanning Electron Microscope (SEM)', category: 'MICROSCOPY', labRoom: 'Science Block Lab 101', status: 'IN_USE', borrower: 'Dr. Arthur Pendelton' },
        { name: 'Fourier Transform Infrared Spectrometer', category: 'SPECTROSCOPY', labRoom: 'Chemistry Wing 304', status: 'AVAILABLE', borrower: null },
        { name: 'Digital Oscilloscope 200MHz', category: 'ELECTRONICS', labRoom: 'EE Lab 205', status: 'AVAILABLE', borrower: null },
      ];

      for (const eq of defaultEquipment) {
        await (prisma as any).labEquipment.create({
          data: { schoolId: school.id, ...eq },
        });
      }

      equipment = await (prisma as any).labEquipment.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(equipment);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch laboratory equipment' }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    const { name, category, labRoom, status, borrower } = await req.json();

    if (!name || !labRoom) {
      return NextResponse.json({ error: 'Equipment name and laboratory room are required' }, { status: 400 });
    }

    const item = await (prisma as any).labEquipment.create({
      data: {
        schoolId: school.id,
        name,
        category: category || 'SCIENTIFIC',
        labRoom,
        status: status || 'AVAILABLE',
        borrower: borrower || null,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register laboratory equipment' }, { status: 500 });
  }
}
