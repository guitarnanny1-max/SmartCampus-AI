export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    let stations = await (prisma as any).smartCampusRadioHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (stations.length === 0) {
      const defaultStations = [
        { stationCode: 'RADIO-915', stationName: 'Campus Voice 91.5 FM - Main Stereo', frequencyMhz: 91.5, broadcastPowerKw: 5.0, activeListenersCount: 3400, aiBroadcastMode: 'AI_AUTONOMOUS_DYNAMIC_PLAYLIST' },
        { stationCode: 'RADIO-102', stationName: 'Research & Science Wave FM', frequencyMhz: 102.3, broadcastPowerKw: 2.0, activeListenersCount: 1120, aiBroadcastMode: 'ACADEMIC_LECTURE_STREAM_INTELLIGENCE' },
        { stationCode: 'RADIO-EMG', stationName: 'Emergency Broadcast Override Network', frequencyMhz: 107.9, broadcastPowerKw: 10.0, activeListenersCount: 8900, aiBroadcastMode: 'EMERGENCY_BROADCAST_SAFETY_OVERRIDE' },
      ];

      for (const s of defaultStations) {
        await (prisma as any).smartCampusRadioHub.create({
          data: { schoolId: school.id, ...s },
        });
      }

      stations = await (prisma as any).smartCampusRadioHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(stations);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch radio station records' }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const school = await getCurrentSchool();
    const { stationCode, stationName, frequencyMhz, broadcastPowerKw, activeListenersCount, aiBroadcastMode } = await req.json();

    if (!stationCode || !stationName) {
      return NextResponse.json({ error: 'Station code and name are required' }, { status: 400 });
    }

    const station = await (prisma as any).smartCampusRadioHub.create({
      data: {
        schoolId: school.id,
        stationCode,
        stationName,
        frequencyMhz: parseFloat(frequencyMhz) || 91.5,
        broadcastPowerKw: parseFloat(broadcastPowerKw) || 2.5,
        activeListenersCount: parseInt(activeListenersCount) || 1250,
        aiBroadcastMode: aiBroadcastMode || 'AI_AUTONOMOUS_DYNAMIC_PLAYLIST',
      },
    });

    return NextResponse.json(station);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register radio station' }, { status: 500 });
  }
}
