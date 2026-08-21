export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    let orders = await (prisma as any).maintenanceWorkOrder.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (orders.length === 0) {
      const defaultOrders = [
        { title: 'Chiller Unit #3 Coolant Leak Repair', category: 'HVAC', building: 'Engineering Complex Block A', priority: 'HIGH', status: 'IN_PROGRESS', assignedTechnician: 'Dave Miller' },
        { title: 'Lecture Hall 201 Projector Bulb Replacement', category: 'ELECTRICAL', building: 'Academic Hall North', priority: 'MEDIUM', status: 'OPEN', assignedTechnician: null },
        { title: 'Main Gate Hydraulic Barrier Maintenance', category: 'MECHANICAL', building: 'Security Perimeter', priority: 'LOW', status: 'RESOLVED', assignedTechnician: 'Samwise Gamgee' },
      ];

      for (const ord of defaultOrders) {
        await (prisma as any).maintenanceWorkOrder.create({
          data: { schoolId: school.id, ...ord },
        });
      }

      orders = await (prisma as any).maintenanceWorkOrder.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch maintenance work orders' }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    const { title, category, building, priority, assignedTechnician } = await req.json();

    if (!title || !building) {
      return NextResponse.json({ error: 'Title and building are required' }, { status: 400 });
    }

    const order = await (prisma as any).maintenanceWorkOrder.create({
      data: {
        schoolId: school.id,
        title,
        category: category || 'HVAC',
        building,
        priority: priority || 'MEDIUM',
        status: 'OPEN',
        assignedTechnician: assignedTechnician || null,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create work order' }, { status: 500 });
  }
}
