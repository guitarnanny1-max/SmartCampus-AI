export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let cleanrooms = await prisma.smartNanotechHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (cleanrooms.length === 0) {
      const defaultCleanrooms = [
        { cleanroomCode: 'NANO-ROOM-01', cleanroomName: 'Class 1 Molecular Epitaxy Cleanroom', isoClass: 1, aldRateAngstromsPerMin: 15.0, assemblyPrecisionPct: 99.995, aiDefectInspectionMode: 'ATOMIC_FORCE_MICROSCOPY_NEURAL_VISION' },
        { cleanroomCode: 'NANO-ROOM-02', cleanroomName: 'Carbon Nanotube Synthesis Foundry', isoClass: 3, aldRateAngstromsPerMin: 22.5, assemblyPrecisionPct: 99.95, aiDefectInspectionMode: 'ELECTRON_BEAM_LITHOGRAPHY_FEEDBACK' },
        { cleanroomCode: 'NANO-ROOM-03', cleanroomName: 'Quantum Dot & Semiconductor Cleanlab', isoClass: 1, aldRateAngstromsPerMin: 10.2, assemblyPrecisionPct: 99.99, aiDefectInspectionMode: 'RAMAN_SPECTROSCOPY_DEFECT_MAPPER' },
      ];

      for (const c of defaultCleanrooms) {
        await prisma.smartNanotechHub.create({
          data: { schoolId: school.id, ...c },
        });
      }

      cleanrooms = await prisma.smartNanotechHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(cleanrooms);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch nanotechnology records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { cleanroomCode, cleanroomName, isoClass, aldRateAngstromsPerMin, assemblyPrecisionPct, aiDefectInspectionMode } = await req.json();

    if (!cleanroomCode || !cleanroomName) {
      return NextResponse.json({ error: 'Cleanroom code and name are required' }, { status: 400 });
    }

    const cleanroom = await prisma.smartNanotechHub.create({
      data: {
        schoolId: school.id,
        cleanroomCode,
        cleanroomName,
        isoClass: parseInt(isoClass) || 1,
        aldRateAngstromsPerMin: parseFloat(aldRateAngstromsPerMin) || 12.5,
        assemblyPrecisionPct: parseFloat(assemblyPrecisionPct) || 99.99,
        aiDefectInspectionMode: aiDefectInspectionMode || 'ATOMIC_FORCE_MICROSCOPY_NEURAL_VISION',
      },
    });

    return NextResponse.json(cleanroom);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register cleanroom facility' }, { status: 500 });
  }
}
