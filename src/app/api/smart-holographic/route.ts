export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let halls = await prisma.smartHolographicHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (halls.length === 0) {
      const defaultHalls = [
        { lectureHallCode: 'HOLO-HALL-01', hallName: 'Grand Immersive Amphitheater Alpha', holographicFidelityPct: 99.8, audioLatencyMs: 3.1, concurrentAvatarsCount: 500, aiRealTimeTranslationMode: 'NEURAL_SYNCHRONOUS_MULTI_LANGUAGE' },
        { lectureHallCode: 'HOLO-HALL-02', hallName: 'Quantum Physics Telepresence Auditorium', holographicFidelityPct: 99.2, audioLatencyMs: 4.5, concurrentAvatarsCount: 250, aiRealTimeTranslationMode: 'BIOMETRIC_GAZE_SYNCHRONIZATION' },
        { lectureHallCode: 'HOLO-HALL-03', hallName: 'Medical Anatomy 3D Projection Suite', holographicFidelityPct: 99.6, audioLatencyMs: 2.8, concurrentAvatarsCount: 180, aiRealTimeTranslationMode: 'ANATOMICAL_VOLUMETRIC_RENDERING' },
      ];

      for (const h of defaultHalls) {
        await prisma.smartHolographicHub.create({
          data: { schoolId: school.id, ...h },
        });
      }

      halls = await prisma.smartHolographicHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(halls);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch holographic lecture records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { lectureHallCode, hallName, holographicFidelityPct, audioLatencyMs, concurrentAvatarsCount, aiRealTimeTranslationMode } = await req.json();

    if (!lectureHallCode || !hallName) {
      return NextResponse.json({ error: 'Lecture hall code and name are required' }, { status: 400 });
    }

    const hall = await prisma.smartHolographicHub.create({
      data: {
        schoolId: school.id,
        lectureHallCode,
        hallName,
        holographicFidelityPct: parseFloat(holographicFidelityPct) || 99.4,
        audioLatencyMs: parseFloat(audioLatencyMs) || 4.2,
        concurrentAvatarsCount: parseInt(concurrentAvatarsCount) || 300,
        aiRealTimeTranslationMode: aiRealTimeTranslationMode || 'NEURAL_SYNCHRONOUS_MULTI_LANGUAGE',
      },
    });

    return NextResponse.json(hall);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register holographic hall' }, { status: 500 });
  }
}
