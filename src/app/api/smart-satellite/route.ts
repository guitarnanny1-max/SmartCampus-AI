export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let stations = await prisma.smartSatelliteHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (stations.length === 0) {
      const defaultStations = [
        { stationCode: 'SAT-STATION-01', stationName: 'Deep Space Radio Telescope Alpha', downlinkBandwidthGbps: 80.0, orbitalTrackingArcsec: 0.02, signalToNoiseDb: 38.5, aiScintillationMode: 'ADAPTIVE_OPTICS_ATMOSPHERIC_COMPENSATION' },
        { stationCode: 'SAT-STATION-02', stationName: 'LEO Constellation Tracking Hub', downlinkBandwidthGbps: 120.0, orbitalTrackingArcsec: 0.08, signalToNoiseDb: 34.0, aiScintillationMode: 'REAL_TIME_DOPPLER_SHIFT_CORRECTION' },
        { stationCode: 'SAT-STATION-03', stationName: 'Quantum Entanglement Uplink Node', downlinkBandwidthGbps: 40.5, orbitalTrackingArcsec: 0.01, signalToNoiseDb: 42.0, aiScintillationMode: 'QUANTUM_PHASE_NOISE_CANCELLATION' },
      ];

      for (const s of defaultStations) {
        await prisma.smartSatelliteHub.create({
          data: { schoolId: school.id, ...s },
        });
      }

      stations = await prisma.smartSatelliteHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(stations);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch satellite records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { stationCode, stationName, downlinkBandwidthGbps, orbitalTrackingArcsec, signalToNoiseDb, aiScintillationMode } = await req.json();

    if (!stationCode || !stationName) {
      return NextResponse.json({ error: 'Station code and name are required' }, { status: 400 });
    }

    const station = await prisma.smartSatelliteHub.create({
      data: {
        schoolId: school.id,
        stationCode,
        stationName,
        downlinkBandwidthGbps: parseFloat(downlinkBandwidthGbps) || 45.0,
        orbitalTrackingArcsec: parseFloat(orbitalTrackingArcsec) || 0.05,
        signalToNoiseDb: parseFloat(signalToNoiseDb) || 32.5,
        aiScintillationMode: aiScintillationMode || 'ADAPTIVE_OPTICS_ATMOSPHERIC_COMPENSATION',
      },
    });

    return NextResponse.json(station);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register satellite ground station' }, { status: 500 });
  }
}
