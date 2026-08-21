import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";




export async function GET() {
  try {
    const tenants = await prisma.tenant.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ success: true, schools: tenants });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, subdomain, plan, contactEmail } = await req.json();

    if (!name || !subdomain) {
      return NextResponse.json({ error: "Name and subdomain are required." }, { status: 400 });
    }

    const cleanSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, "");

    const existing = await prisma.tenant.findUnique({ where: { subdomain: cleanSubdomain } });
    if (existing) {
      return NextResponse.json({ error: "Subdomain already taken." }, { status: 400 });
    }

    const tenant = await prisma.tenant.create({
      data: {
        name,
        subdomain: cleanSubdomain,
        plan: plan || "school-growth",
        contactEmail: contactEmail || `admin@${cleanSubdomain}.com`,
        status: "ACTIVE",
        mrr: plan === "digital-starter" ? 999 : plan === "school-growth" ? 2999 : 5999,
        setupFeePaid: true
      }
    });

    return NextResponse.json({ success: true, school: tenant });
  } catch (error: any) {
    console.error("Schools API Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error." }, { status: 500 });
  }
}
