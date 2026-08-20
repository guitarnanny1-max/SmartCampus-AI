export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let nodes = await prisma.smartCybersecurityHub.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (nodes.length === 0) {
      const defaultNodes = [
        { nodeCode: 'SEC-NODE-01', nodeName: 'Central Data Center Quantum Core', intrusionAttemptsDaily: 4500, qkdFidelityPct: 99.99, neuralDefenseLatencyMs: 0.5, aiAnomalyResponseMode: 'AUTONOMOUS_QUANTUM_THREAT_NEUTRALIZATION' },
        { nodeCode: 'SEC-NODE-02', nodeName: 'Research Laboratory Mesh Network', intrusionAttemptsDaily: 890, qkdFidelityPct: 99.75, neuralDefenseLatencyMs: 1.2, aiAnomalyResponseMode: 'PREDICTIVE_PATTERN_HEURISTIC_BLOCKING' },
        { nodeCode: 'SEC-NODE-03', nodeName: 'Campus Public Wi-Fi Edge Security', intrusionAttemptsDaily: 12400, qkdFidelityPct: 98.4, neuralDefenseLatencyMs: 2.5, aiAnomalyResponseMode: 'REAL_TIME_TRAFFIC_SHAPING_DEFENSE' },
      ];

      for (const n of defaultNodes) {
        await prisma.smartCybersecurityHub.create({
          data: { schoolId: school.id, ...n },
        });
      }

      nodes = await prisma.smartCybersecurityHub.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(nodes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch cybersecurity records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { nodeCode, nodeName, intrusionAttemptsDaily, qkdFidelityPct, neuralDefenseLatencyMs, aiAnomalyResponseMode } = await req.json();

    if (!nodeCode || !nodeName) {
      return NextResponse.json({ error: 'Node code and name are required' }, { status: 400 });
    }

    const node = await prisma.smartCybersecurityHub.create({
      data: {
        schoolId: school.id,
        nodeCode,
        nodeName,
        intrusionAttemptsDaily: parseInt(intrusionAttemptsDaily) || 1000,
        qkdFidelityPct: parseFloat(qkdFidelityPct) || 99.9,
        neuralDefenseLatencyMs: parseFloat(neuralDefenseLatencyMs) || 1.0,
        aiAnomalyResponseMode: aiAnomalyResponseMode || 'AUTONOMOUS_QUANTUM_THREAT_NEUTRALIZATION',
      },
    });

    return NextResponse.json(node);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register security node' }, { status: 500 });
  }
}
