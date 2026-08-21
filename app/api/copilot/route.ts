import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";




export async function POST(req: Request) {
  try {
    const { subdomain, prompt } = await req.json();

    if (!subdomain) {
      return NextResponse.json({ success: false, error: "Subdomain is required." }, { status: 400 });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { subdomain },
      include: { students: true, invoices: true, announcements: true }
    });

    if (!tenant) {
      return NextResponse.json({ success: false, error: "Tenant workspace not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      analysis: `Analyzed workspace for ${tenant.name}. Total students: ${tenant.students.length}, Invoices: ${tenant.invoices.length}.`,
      recommendation: "All systems operating within normal multi-tenant parameters."
    });
  } catch (error: any) {
    console.error("Copilot API Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal server error." }, { status: 500 });
  }
}
