export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let processors = await prisma.smartQuantumComputingHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (processors.length === 0) {
      const defaultProcessors = [
        { processorCode: 'QUANTUM-PROC-01', processorName: 'Superconducting Qubit Array Alpha', activeQubits: 256, cryogenicTempMillikelvin: 12.5, coherenceTimeMicrosec: 600.0, aiErrorCorrectionMode: 'TOPOLOGICAL_SURFACE_CODE_CORRECTION' },
        { processorCode: 'QUANTUM-PROC-02', processorName: 'Trapped-Ion Quantum Simulator', activeQubits: 128, cryogenicTempMillikelvin: 1.8, coherenceTimeMicrosec: 1200.0, aiErrorCorrectionMode: 'NEURAL_DECOHERENCE_PREDICTION' },
        { processorCode: 'QUANTUM-PROC-03', processorName: 'Photonic Quantum Annealing Node', activeQubits: 512, cryogenicTempMillikelvin: 4.2, coherenceTimeMicrosec: 350.0, aiErrorCorrectionMode: 'ACTIVE_ENTANGLEMENT_STABILIZATION' },
      ];

      for (const p of defaultProcessors) {
        await prisma.smartQuantumComputingHub.create({
          data: { schoolId: school.id, ...p },
        });
      }

      processors = await prisma.smartQuantumComputingHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(processors);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch quantum computing records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { processorCode, processorName, activeQubits, cryogenicTempMillikelvin, coherenceTimeMicrosec, aiErrorCorrectionMode } = await req.json();

    if (!processorCode || !processorName) {
      return NextResponse.json({ error: 'Processor code and name are required' }, { status: 400 });
    }

    const processor = await prisma.smartQuantumComputingHub.create({
      data: {
        schoolId: school.id,
        processorCode,
        processorName,
        activeQubits: parseInt(activeQubits) || 128,
        cryogenicTempMillikelvin: parseFloat(cryogenicTempMillikelvin) || 15.0,
        coherenceTimeMicrosec: parseFloat(coherenceTimeMicrosec) || 450.0,
        aiErrorCorrectionMode: aiErrorCorrectionMode || 'TOPOLOGICAL_SURFACE_CODE_CORRECTION',
      },
    });

    return NextResponse.json(processor);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register quantum processor' }, { status: 500 });
  }
}
