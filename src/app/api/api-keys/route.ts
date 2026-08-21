import { prisma } from "@/lib/prisma";
export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";

import crypto from "crypto";



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

    const apiKeys = await (prisma as any).apiKey.findMany({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ apiKeys });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: any): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { tenantId, name } = body;

    const tenant = tenantId 
      ? await (prisma as any).tenant.findUnique({ where: { id: tenantId } })
      : await (prisma as any).tenant.findFirst();

    if (!tenant) {
      return NextResponse.json({ error: "Tenant workspace not found" }, { status: 404 });
    }

    const randomString = crypto.randomBytes(16).toString("hex");
    const key = `sc_live_${tenant.subdomain}_${randomString}`;

    const apiKey = await (prisma as any).apiKey.create({
      data: {
        tenantId: tenant.id,
        name: name || "Default API Key",
        key,
      },
    });

    return NextResponse.json({ success: true, apiKey }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
