export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    let routes = await (prisma as any).transportRoute.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (routes.length === 0) {
      const defaultRoutes = [
        { busNo: 'BUS-01', routeName: 'Downtown Express / Route A', driverName: 'Michael Schumacher', status: 'ON_ROUTE', capacity: 45, passengers: 38 },
        { busNo: 'BUS-02', routeName: 'Suburban Loop / Route B', driverName: 'Ayrton Senna', status: 'DEPOT', capacity: 45, passengers: 0 },
        { busNo: 'BUS-03', routeName: 'Hostel Shuttle / Route C', driverName: 'Lewis Hamilton', status: 'ON_ROUTE', capacity: 30, passengers: 28 },
      ];

      for (const r of defaultRoutes) {
        await (prisma as any).transportRoute.create({
          data: { schoolId: school.id, ...r },
        });
      }

      routes = await (prisma as any).transportRoute.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(routes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch transport routes' }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    const { busNo, routeName, driverName, capacity, passengers } = await req.json();

    if (!busNo || !routeName || !driverName || capacity === undefined) {
      return NextResponse.json({ error: 'Bus number, route name, driver name, and capacity are required' }, { status: 400 });
    }

    const route = await (prisma as any).transportRoute.create({
      data: {
        schoolId: school.id,
        busNo,
        routeName,
        driverName,
        capacity: parseInt(capacity),
        passengers: passengers ? parseInt(passengers) : 0,
        status: 'ON_ROUTE',
      },
    });

    return NextResponse.json(route);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add transport route' }, { status: 500 });
  }
}
