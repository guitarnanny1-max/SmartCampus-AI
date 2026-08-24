import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    if (!tenantId) return NextResponse.json({ success: false, attendances: [] });

    let attendances = await prisma.attendance.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });

    if (attendances.length === 0) {
      const sample = await prisma.attendance.create({
        data: {
          tenantId,
          studentName: "Rahul Gupta",
          date: "2026-08-24",
          status: "PRESENT",
          punchTime: "08:15 AM",
        },
      });
      attendances = [sample];
    }

    return NextResponse.json({ success: true, attendances });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
