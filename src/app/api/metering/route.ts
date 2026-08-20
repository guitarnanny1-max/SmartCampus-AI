export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();

    let metrics = await prisma.usageMetric.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (metrics.length === 0) {
      // Seed default metrics if none exist
      const defaultMetrics = [
        { metricName: 'Core API Gateway Calls', quantity: 45820, unit: 'requests', cost: 45.80 },
        { metricName: 'IoT Telemetry SSE Streams', quantity: 184500, unit: 'events', cost: 18.45 },
        { metricName: 'AI RAG Inference Tokens', quantity: 1250000, unit: 'tokens', cost: 125.00 },
        { metricName: 'Automated Backup Storage', quantity: 48, unit: 'GB', cost: 9.60 },
      ];

      for (const m of defaultMetrics) {
        await prisma.usageMetric.create({
          data: { schoolId: school.id, ...m },
        });
      }

      metrics = await prisma.usageMetric.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(metrics);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch usage metering data' }, { status: 500 });
  }
}
