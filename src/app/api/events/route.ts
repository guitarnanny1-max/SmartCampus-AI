import { prisma } from "@/lib/prisma";
export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";



export async function GET(req: any): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");

    let events: any[] = [];
    if (schoolId) {
      events = await (prisma as any).eventClub.findMany({
        where: { schoolId },
        orderBy: { createdAt: "desc" },
      });
    }

    if (events.length === 0) {
      events = await (prisma as any).eventClub.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
      });
    }

    return NextResponse.json({ events });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { schoolId, tenantId, name, description, category } = body;

    if (!name) {
      return NextResponse.json({ error: "Event or club name is required" }, { status: 400 });
    }

    const event = await (prisma as any).eventClub.create({
      data: {
        schoolId: schoolId || null,
        tenantId: tenantId || null,
        name,
        description: description || "",
        category: category || "CLUB",
      },
    });

    return NextResponse.json({ success: true, event }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
