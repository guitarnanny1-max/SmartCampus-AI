import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";




export async function POST(req: Request) {
  try {
    const { subdomain, plan } = await req.json();

    if (!subdomain || !plan) {
      return NextResponse.json({ success: false, error: "Subdomain and plan are required." }, { status: 400 });
    }

    const mrr = plan === "digital-starter" ? 999 : plan === "school-growth" ? 2999 : 5999;

    const updatedTenant = await prisma.tenant.update({
      where: { subdomain },
      data: {
        plan,
        mrr
      }
    });

    return NextResponse.json({ success: true, tenant: updatedTenant });
  } catch (error: any) {
    console.error("Upgrade API Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal server error." }, { status: 500 });
  }
}
