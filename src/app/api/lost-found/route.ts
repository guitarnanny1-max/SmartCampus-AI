export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    let items = await (prisma as any).lostItem.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (items.length === 0) {
      const defaultItems = [
        { itemName: 'MacBook Pro 14 Space Gray', locationFound: 'Central Library 2nd Floor', founderName: 'Librarian Sarah', category: 'ELECTRONICS', status: 'AVAILABLE' },
        { itemName: 'Hydro Flask Stainless Water Bottle', locationFound: 'Engineering Lecture Hall 4', founderName: 'Prof. Miller', category: 'PERSONAL', status: 'AVAILABLE' },
        { itemName: 'Calculus 8th Edition Textbook', locationFound: 'Student Union Cafeteria', founderName: 'Cafeteria Staff', category: 'BOOKS', status: 'CLAIMED' },
      ];

      for (const item of defaultItems) {
        await (prisma as any).lostItem.create({
          data: { schoolId: school.id, ...item },
        });
      }

      items = await (prisma as any).lostItem.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(items);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch lost items' }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    const { itemName, locationFound, founderName, category, status } = await req.json();

    if (!itemName || !locationFound || !founderName) {
      return NextResponse.json({ error: 'Item name, location found, and founder name are required' }, { status: 400 });
    }

    const item = await (prisma as any).lostItem.create({
      data: {
        schoolId: school.id,
        itemName,
        locationFound,
        founderName,
        category: category || 'ELECTRONICS',
        status: status || 'AVAILABLE',
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to log lost item' }, { status: 500 });
  }
}
