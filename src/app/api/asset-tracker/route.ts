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

    const assets = await (prisma as any).smartAssetTracker.findMany({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ assets });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { tenantId, name, location, status, battery } = body;

    const tenant = tenantId 
      ? await (prisma as any).tenant.findUnique({ where: { id: tenantId } })
      : await (prisma as any).tenant.findFirst();

    if (!tenant) {
      return NextResponse.json({ error: "Tenant workspace not found" }, { status: 404 });
    }

    const asset = await (prisma as any).smartAssetTracker.create({
      data: {
        tenantId: tenant.id,
        name,
        location: location || "Main Campus",
        status: status || "ACTIVE",
        battery: battery !== undefined ? parseInt(battery) : 100,
      },
    });

    return NextResponse.json({ success: true, asset }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
