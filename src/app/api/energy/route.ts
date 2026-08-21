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

    const grids = await (prisma as any).smartEnergyGrid.findMany({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ grids });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { tenantId, name, status, load } = body;

    if (!name) {
      return NextResponse.json({ error: "Grid name is required" }, { status: 400 });
    }

    const tenant = tenantId 
      ? await (prisma as any).tenant.findUnique({ where: { id: tenantId } })
      : await (prisma as any).tenant.findFirst();

    if (!tenant) {
      return NextResponse.json({ error: "Tenant workspace not found" }, { status: 404 });
    }

    const grid = await (prisma as any).smartEnergyGrid.create({
      data: {
        tenantId: tenant.id,
        name,
        status: status || "ACTIVE",
        load: load !== undefined ? load : 0.0,
      },
    });

    return NextResponse.json({ success: true, grid }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
