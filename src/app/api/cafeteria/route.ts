export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let orders = await prisma.cafeteriaOrder.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (orders.length === 0) {
      const defaultOrders = [
        { studentName: 'Alex Mercer', mealType: 'LUNCH', itemTitle: 'Grilled Chicken & Quinoa Bowl', dietaryTag: 'STANDARD', price: 8.50, status: 'SERVED' },
        { studentName: 'Elena Rostova', mealType: 'BREAKFAST', itemTitle: 'Avocado Toast & Oat Milk Latte', dietaryTag: 'VEGAN', price: 6.00, status: 'SERVED' },
        { studentName: 'Marcus Vance', mealType: 'DINNER', itemTitle: 'Tofu Stir Fry with Jasmine Rice', dietaryTag: 'GLUTEN_FREE', price: 9.25, status: 'PREPARING' },
      ];

      for (const o of defaultOrders) {
        await prisma.cafeteriaOrder.create({
          data: { schoolId: school.id, ...o },
        });
      }

      orders = await prisma.cafeteriaOrder.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch cafeteria orders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { studentName, mealType, itemTitle, dietaryTag, price } = await req.json();

    if (!studentName || !mealType || !itemTitle || !price) {
      return NextResponse.json({ error: 'Student name, meal type, item title, and price are required' }, { status: 400 });
    }

    const order = await prisma.cafeteriaOrder.create({
      data: {
        schoolId: school.id,
        studentName,
        mealType,
        itemTitle,
        dietaryTag: dietaryTag || 'STANDARD',
        price: parseFloat(price),
        status: 'SERVED',
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to record cafeteria transaction' }, { status: 500 });
  }
}
