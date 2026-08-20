export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let nodes = await prisma.smartQuantumResearchHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (nodes.length === 0) {
      const defaultNodes = [
        { researchNodeCode: 'Q-NODE-01', facilityName: 'Advanced Quantum Processing & Cryogenics Lab', qubitCoherencePct: 99.6, cryogenicCoolingKelvin: 0.012, workloadCapacityTflops: 8500.0, aiJobSchedulerMode: 'QUANTUM_CLASSICAL_HYBRID_OPTIMIZATION' },
        { researchNodeCode: 'HPC-NODE-02', facilityName: 'Exascale AI Supercomputing Data Center', qubitCoherencePct: 98.9, cryogenicCoolingKelvin: 1.200, workloadCapacityTflops: 24000.0, aiJobSchedulerMode: 'PREDICTIVE_WORKLOAD_BALANCING' },
        { researchNodeCode: 'BIO-NODE-03', facilityName: 'Synthetic Biology & Molecular Simulation Cluster', qubitCoherencePct: 99.1, cryogenicCoolingKelvin: 0.015, workloadCapacityTflops: 12000.0, aiJobSchedulerMode: 'DEEP_LEARNING_PROTEIN_FOLDING' },
      ];

      for (const n of defaultNodes) {
        await prisma.smartQuantumResearchHub.create({
          data: { schoolId: school.id, ...n },
        });
      }

      nodes = await prisma.smartQuantumResearchHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(nodes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch quantum research records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { researchNodeCode, facilityName, qubitCoherencePct, cryogenicCoolingKelvin, workloadCapacityTflops, aiJobSchedulerMode } = await req.json();

    if (!researchNodeCode || !facilityName) {
      return NextResponse.json({ error: 'Research node code and facility name are required' }, { status: 400 });
    }

    const node = await prisma.smartQuantumResearchHub.create({
      data: {
        schoolId: school.id,
        researchNodeCode,
        facilityName,
        qubitCoherencePct: parseFloat(qubitCoherencePct) || 99.2,
        cryogenicCoolingKelvin: parseFloat(cryogenicCoolingKelvin) || 0.015,
        workloadCapacityTflops: parseFloat(workloadCapacityTflops) || 4500.0,
        aiJobSchedulerMode: aiJobSchedulerMode || 'QUANTUM_CLASSICAL_HYBRID_OPTIMIZATION',
      },
    });

    return NextResponse.json(node);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register research node' }, { status: 500 });
  }
}
