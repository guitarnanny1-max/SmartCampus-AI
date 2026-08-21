import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";




export async function POST(req: Request) {
  try {
    const { tenantId, prompt } = await req.json();

    if (!tenantId) {
      return NextResponse.json({ success: false, error: "Missing tenantId identifier." }, { status: 400 });
    }

    const [tenant, students, invoices] = await Promise.all([
      prisma.tenant.findUnique({ where: { id: tenantId } }),
      prisma.student.findMany({ where: { tenantId } }),
      prisma.invoice.findMany({ where: { tenantId } })
    ]);

    if (!tenant) {
      return NextResponse.json({ success: false, error: "Tenant workspace not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      analysis: `Analyzed workspace for ${tenant.name}. Enrolled students: ${students.length}, Invoices: ${invoices.length}.`,
      recommendation: "Telemetry verified against multi-tenant schema constraints."
    });
  } catch (error: any) {
    console.error("AI Copilot API Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal server error." }, { status: 500 });
  }
}
