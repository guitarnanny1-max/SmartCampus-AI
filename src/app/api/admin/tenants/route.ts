import { prisma } from "@/lib/prisma";
export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";




export async function POST(request: any): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { name, subdomain, plan, mrr, contactEmail } = body;

    if (!name || !subdomain) {
      return NextResponse.json({ error: "Name and subdomain are required" }, { status: 400 });
    }

    const tenant = await (prisma as any).tenant.create({
      data: {
        name,
        subdomain,
        plan: plan || "digital-starter",
        mrr: mrr ? parseFloat(mrr) : 0.0,
        contactEmail: contactEmail || null,
        status: "ACTIVE",
        setupFeePaid: true
      }
    });

    return NextResponse.json({ success: true, tenant }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    const tenants = await (prisma as any).tenant.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ tenants });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
