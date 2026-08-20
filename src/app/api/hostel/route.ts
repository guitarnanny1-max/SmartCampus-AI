export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let rooms = await prisma.hostelRoom.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (rooms.length === 0) {
      const defaultRooms = [
        { roomNo: 'A-204', blockName: 'Newton Hall (Boys)', capacity: 2, occupancy: 2, status: 'FULL' },
        { roomNo: 'B-112', blockName: 'Curie Hall (Girls)', capacity: 2, occupancy: 1, status: 'AVAILABLE' },
        { roomNo: 'C-305', blockName: 'Turing Hall (Co-Ed)', capacity: 1, occupancy: 0, status: 'AVAILABLE' },
      ];

      for (const r of defaultRooms) {
        await prisma.hostelRoom.create({
          data: { schoolId: school.id, ...r },
        });
      }

      rooms = await prisma.hostelRoom.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(rooms);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch hostel rooms' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { roomNo, blockName, capacity, occupancy } = await req.json();

    if (!roomNo || !blockName || capacity === undefined) {
      return NextResponse.json({ error: 'Room number, block name, and capacity are required' }, { status: 400 });
    }

    const occ = occupancy ? parseInt(occupancy) : 0;
    const cap = parseInt(capacity);
    const status = occ >= cap ? 'FULL' : 'AVAILABLE';

    const room = await prisma.hostelRoom.create({
      data: {
        schoolId: school.id,
        roomNo,
        blockName,
        capacity: cap,
        occupancy: occ,
        status,
      },
    });

    return NextResponse.json(room);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add hostel room' }, { status: 500 });
  }
}
