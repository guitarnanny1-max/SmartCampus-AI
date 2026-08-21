import { prisma } from "@/lib/prisma";
export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";



export async function GET(req: any): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");

    let records: any[] = [];
    if (schoolId) {
      records = await (prisma as any).medicalRecord.findMany({
        where: { schoolId },
        orderBy: { createdAt: "desc" },
      });
    }

    if (records.length === 0) {
      records = await (prisma as any).medicalRecord.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
      });
    }

    return NextResponse.json({ records });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { schoolId, tenantId, studentName, condition, status } = body;

    if (!studentName || !condition) {
      return NextResponse.json({ error: "Student name and condition are required" }, { status: 400 });
    }

    const record = await (prisma as any).medicalRecord.create({
      data: {
        schoolId: schoolId || null,
        tenantId: tenantId || null,
        studentName,
        condition,
        status: status || "ACTIVE",
      },
    });

    return NextResponse.json({ success: true, record }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
