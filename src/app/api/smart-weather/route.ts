export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let stations = await prisma.smartWeatherStation.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (stations.length === 0) {
      const defaultStations = [
        { stationCode: 'WX-ROOF-01', stationName: 'Main Science Roof Meteorological Station', windSpeedKmh: 14.2, barometricPressureHpa: 1014.1, uvIndex: 5.8, precipitationMm: 0.0, weatherAlertStatus: 'NORMAL' },
        { stationCode: 'WX-VALLEY-02', stationName: 'Athletic Fields Weather Array', windSpeedKmh: 22.0, barometricPressureHpa: 1011.5, uvIndex: 7.4, precipitationMm: 1.2, weatherAlertStatus: 'WIND_ADVISORY' },
        { stationCode: 'WX-FOREST-03', stationName: 'Campus Arboretum Canopy Sensor', windSpeedKmh: 8.5, barometricPressureHpa: 1013.8, uvIndex: 3.1, precipitationMm: 0.0, weatherAlertStatus: 'NORMAL' },
      ];

      for (const s of defaultStations) {
        await prisma.smartWeatherStation.create({
          data: { schoolId: school.id, ...s },
        });
      }

      stations = await prisma.smartWeatherStation.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(stations);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch weather stations' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { stationCode, stationName, windSpeedKmh, barometricPressureHpa, uvIndex, precipitationMm, weatherAlertStatus } = await req.json();

    if (!stationCode || !stationName) {
      return NextResponse.json({ error: 'Station code and name are required' }, { status: 400 });
    }

    const station = await prisma.smartWeatherStation.create({
      data: {
        schoolId: school.id,
        stationCode,
        stationName,
        windSpeedKmh: parseFloat(windSpeedKmh) || 12.5,
        barometricPressureHpa: parseFloat(barometricPressureHpa) || 1013.25,
        uvIndex: parseFloat(uvIndex) || 4.2,
        precipitationMm: parseFloat(precipitationMm) || 0.0,
        weatherAlertStatus: weatherAlertStatus || 'NORMAL',
      },
    });

    return NextResponse.json(station);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register weather station' }, { status: 500 });
  }
}
