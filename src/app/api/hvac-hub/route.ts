import { prisma } from "@/lib/prisma";
export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";



export async function GET(req: any): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");

    let units: any[] = [];
    if (schoolId) {
      units = await (prisma as any).smartHvacUnit.findMany({
        where: { schoolId },
        orderBy: { createdAt: "desc" },
      });
    }

    if (units.length === 0) {
      units = await (prisma as any).smartHvacUnit.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
      });
    }

    return NextResponse.json({ units });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { schoolId, tenantId, name, temperature, status } = body;

    if (!name) {
      return NextResponse.json({ error: "HVAC unit name is required" }, { status: 400 });
    }

    const unit = await (prisma as any).smartHvacUnit.create({
      data: {
        schoolId: schoolId || null,
        tenantId: tenantId || null,
        name,
        temperature: temperature !== undefined ? Number(temperature) : 22.0,
        status: status || "ACTIVE",
      },
    });

    return NextResponse.json({ success: true, unit }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
