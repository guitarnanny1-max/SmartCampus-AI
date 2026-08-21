import { prisma } from "@/lib/prisma";
export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";



export async function GET(req: any): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");

    let systems: any[] = [];
    if (schoolId) {
      systems = await (prisma as any).smartFireSafetySystem.findMany({
        where: { schoolId },
        orderBy: { createdAt: "desc" },
      });
    }

    if (systems.length === 0) {
      systems = await (prisma as any).smartFireSafetySystem.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
      });
    }

    return NextResponse.json({ systems });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { schoolId, tenantId, name, status, location } = body;

    if (!name) {
      return NextResponse.json({ error: "System name is required" }, { status: 400 });
    }

    const system = await (prisma as any).smartFireSafetySystem.create({
      data: {
        schoolId: schoolId || null,
        tenantId: tenantId || null,
        name,
        status: status || "ACTIVE",
        location: location || "",
      },
    });

    return NextResponse.json({ success: true, system }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
