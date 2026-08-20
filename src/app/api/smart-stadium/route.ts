export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let stadiums = await prisma.smartStadiumAthletics.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (stadiums.length === 0) {
      const defaultStadiums = [
        { stadiumCode: 'STD-MAIN-01', stadiumName: 'University Grand Memorial Stadium', sportCategory: 'FOOTBALL_TRACK', turfMoisturePct: 39.2, floodlightStatus: 'FULL_BRIGHTNESS', spectatorCount: 4200, aiMaintenanceStatus: 'OPTIMIZED' },
        { stadiumCode: 'STD-SOCCER-02', stadiumName: 'North Turf Practice Pitch #2', sportCategory: 'SOCCER', turfMoisturePct: 41.0, floodlightStatus: 'AUTO_DIMMED', spectatorCount: 150, aiMaintenanceStatus: 'IRRIGATION_SCHEDULED' },
        { stadiumCode: 'STD-TRACK-03', stadiumName: 'Olympic All-Weather Running Track', sportCategory: 'TRACK_FIELD', turfMoisturePct: 35.0, floodlightStatus: 'STANDBY', spectatorCount: 85, aiMaintenanceStatus: 'OPTIMIZED' },
      ];

      for (const s of defaultStadiums) {
        await prisma.smartStadiumAthletics.create({
          data: { schoolId: school.id, ...s },
        });
      }

      stadiums = await prisma.smartStadiumAthletics.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(stadiums);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch smart stadium records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { stadiumCode, stadiumName, sportCategory, turfMoisturePct, floodlightStatus, spectatorCount, aiMaintenanceStatus } = await req.json();

    if (!stadiumCode || !stadiumName) {
      return NextResponse.json({ error: 'Stadium code and name are required' }, { status: 400 });
    }

    const stadium = await prisma.smartStadiumAthletics.create({
      data: {
        schoolId: school.id,
        stadiumCode,
        stadiumName,
        sportCategory: sportCategory || 'FOOTBALL_TRACK',
        turfMoisturePct: parseFloat(turfMoisturePct) || 38.5,
        floodlightStatus: floodlightStatus || 'AUTO_DIMMED',
        spectatorCount: parseInt(spectatorCount) || 0,
        aiMaintenanceStatus: aiMaintenanceStatus || 'OPTIMIZED',
      },
    });

    return NextResponse.json(stadium);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register smart stadium' }, { status: 500 });
  }
}
