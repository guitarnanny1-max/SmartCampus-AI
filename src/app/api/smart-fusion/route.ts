export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let reactors = await prisma.smartFusionHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (reactors.length === 0) {
      const defaultReactors = [
        { reactorCode: 'FUSION-TORUS-01', reactorName: 'Tokamak Magnetic Confinement Alpha', plasmaTempMillionCelsius: 165.0, magneticFieldTesla: 14.2, containmentStabilityPct: 99.99, aiMhdInstabilityMode: 'NEURAL_MAGNETOHYDRODYNAMIC_FEEDBACK' },
        { reactorCode: 'FUSION-INERT-02', reactorName: 'Laser Inertial Confinement Facility', plasmaTempMillionCelsius: 210.5, magneticFieldTesla: 8.5, containmentStabilityPct: 99.95, aiMhdInstabilityMode: 'PICOSECOND_LASER_BEAM_ALIGNMENT' },
        { reactorCode: 'FUSION-COMP-03', reactorName: 'Compact Stellarator Research Reactor', plasmaTempMillionCelsius: 140.0, magneticFieldTesla: 11.0, containmentStabilityPct: 99.92, aiMhdInstabilityMode: '3D_MAGNETIC_COIL_OPTIMIZATION' },
      ];

      for (const r of defaultReactors) {
        await prisma.smartFusionHub.create({
          data: { schoolId: school.id, ...r },
        });
      }

      reactors = await prisma.smartFusionHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(reactors);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch fusion reactor records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { reactorCode, reactorName, plasmaTempMillionCelsius, magneticFieldTesla, containmentStabilityPct, aiMhdInstabilityMode } = await req.json();

    if (!reactorCode || !reactorName) {
      return NextResponse.json({ error: 'Reactor code and name are required' }, { status: 400 });
    }

    const reactor = await prisma.smartFusionHub.create({
      data: {
        schoolId: school.id,
        reactorCode,
        reactorName,
        plasmaTempMillionCelsius: parseFloat(plasmaTempMillionCelsius) || 150.0,
        magneticFieldTesla: parseFloat(magneticFieldTesla) || 12.0,
        containmentStabilityPct: parseFloat(containmentStabilityPct) || 99.9,
        aiMhdInstabilityMode: aiMhdInstabilityMode || 'NEURAL_MAGNETOHYDRODYNAMIC_FEEDBACK',
      },
    });

    return NextResponse.json(reactor);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register fusion reactor' }, { status: 500 });
  }
}
