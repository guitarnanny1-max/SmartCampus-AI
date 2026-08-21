import { prisma } from "@/lib/prisma";
export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";



export async function GET(req: any): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");

    let metrics: any[] = [];
    if (schoolId) {
      metrics = await (prisma as any).esgMetric.findMany({
        where: { schoolId },
        orderBy: { createdAt: "desc" },
      });
    }

    if (metrics.length === 0) {
      metrics = await (prisma as any).esgMetric.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
      });
    }

    return NextResponse.json({ metrics });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { schoolId, tenantId, metricName, value, unit } = body;

    if (!metricName) {
      return NextResponse.json({ error: "Metric name is required" }, { status: 400 });
    }

    const metric = await (prisma as any).esgMetric.create({
      data: {
        schoolId: schoolId || null,
        tenantId: tenantId || null,
        metricName,
        value: value !== undefined ? Number(value) : 0.0,
        unit: unit || "",
      },
    });

    return NextResponse.json({ success: true, metric }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
