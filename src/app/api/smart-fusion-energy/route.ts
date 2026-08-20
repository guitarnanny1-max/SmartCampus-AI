export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let reactors = await prisma.smartFusionEnergyHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (reactors.length === 0) {
      const defaultReactors = [
        { reactorCode: 'FUSION-RX-01', facilityName: 'Tokamak Experimental Magnetic Confinement Reactor Alpha', plasmaTempMillionsK: 165.0, magneticConfinementTesla: 14.2, energyOutputMegawatts: 500.0, aiInstabilityPrediction: 'MAGNETOHYDRODYNAMIC_FEEDBACK_LOOP' },
        { reactorCode: 'FUSION-RX-02', facilityName: 'Stellarator Continuous Plasma Research Facility', plasmaTempMillionsK: 140.0, magneticConfinementTesla: 12.8, energyOutputMegawatts: 380.0, aiInstabilityPrediction: 'NEURAL_EDGE_LOCALIZED_MODE_SUPPRESSION' },
        { reactorCode: 'FUSION-RX-03', facilityName: 'Compact Inertial Confinement Laser Fusion Bay', plasmaTempMillionsK: 180.0, magneticConfinementTesla: 16.0, energyOutputMegawatts: 620.0, aiInstabilityPrediction: 'DEEP_REINFORCEMENT_PLAZMA_STABILIZATION' },
      ];

      for (const r of defaultReactors) {
        await prisma.smartFusionEnergyHub.create({
          data: { schoolId: school.id, ...r },
        });
      }

      reactors = await prisma.smartFusionEnergyHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(reactors);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch fusion energy records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { reactorCode, facilityName, plasmaTempMillionsK, magneticConfinementTesla, energyOutputMegawatts, aiInstabilityPrediction } = await req.json();

    if (!reactorCode || !facilityName) {
      return NextResponse.json({ error: 'Reactor code and facility name are required' }, { status: 400 });
    }

    const reactor = await prisma.smartFusionEnergyHub.create({
      data: {
        schoolId: school.id,
        reactorCode,
        facilityName,
        plasmaTempMillionsK: parseFloat(plasmaTempMillionsK) || 150.0,
        magneticConfinementTesla: parseFloat(magneticConfinementTesla) || 13.5,
        energyOutputMegawatts: parseFloat(energyOutputMegawatts) || 450.0,
        aiInstabilityPrediction: aiInstabilityPrediction || 'MAGNETOHYDRODYNAMIC_FEEDBACK_LOOP',
      },
    });

    return NextResponse.json(reactor);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register fusion reactor' }, { status: 500 });
  }
}
