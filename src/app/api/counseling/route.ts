import { prisma } from "@/lib/prisma";
export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";




export async function GET(req: any): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get("tenantId");

    const tenant = tenantId 
      ? await (prisma as any).tenant.findUnique({ where: { id: tenantId } })
      : await (prisma as any).tenant.findFirst();

    if (!tenant) {
      return NextResponse.json({ error: "Tenant workspace not found" }, { status: 404 });
    }

    const sessions = await (prisma as any).counselingSession.findMany({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ sessions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { tenantId, studentName, counselor, status, notes } = body;

    if (!studentName || !counselor) {
      return NextResponse.json({ error: "Student name and counselor are required" }, { status: 400 });
    }

    const tenant = tenantId 
      ? await (prisma as any).tenant.findUnique({ where: { id: tenantId } })
      : await (prisma as any).tenant.findFirst();

    if (!tenant) {
      return NextResponse.json({ error: "Tenant workspace not found" }, { status: 404 });
    }

    const session = await (prisma as any).counselingSession.create({
      data: {
        tenantId: tenant.id,
        studentName,
        counselor,
        status: status || "SCHEDULED",
        notes,
      },
    });

    return NextResponse.json({ success: true, session }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
