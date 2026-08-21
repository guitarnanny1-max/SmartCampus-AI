import { prisma } from "@/lib/prisma";
export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";



export async function GET(req: any): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");

    let rooms: any[] = [];
    if (schoolId) {
      rooms = await (prisma as any).hostelRoom.findMany({
        where: { schoolId },
        orderBy: { createdAt: "desc" },
      });
    }

    if (rooms.length === 0) {
      rooms = await (prisma as any).hostelRoom.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
      });
    }

    return NextResponse.json({ rooms });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { schoolId, tenantId, roomNumber, capacity, status } = body;

    if (!roomNumber) {
      return NextResponse.json({ error: "Room number is required" }, { status: 400 });
    }

    const room = await (prisma as any).hostelRoom.create({
      data: {
        schoolId: schoolId || null,
        tenantId: tenantId || null,
        roomNumber,
        capacity: capacity !== undefined ? Number(capacity) : 2,
        status: status || "AVAILABLE",
      },
    });

    return NextResponse.json({ success: true, room }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
