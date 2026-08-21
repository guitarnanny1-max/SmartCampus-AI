import { prisma } from "@/lib/prisma";
export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";




export async function POST(req: any): Promise<NextResponse> {
  try {
    const { prompt, tenantId } = await req.json();

    const tenant = await (prisma as any).tenant.findUnique({
      where: { id: tenantId },
      include: {
        students: true,
        staff: true,
        energyLogs: true,
        invoices: true,
      },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant workspace not found" }, { status: 404 });
    }

    // Mock AI intelligent response using workspace telemetry
    const studentCount = tenant.students.length;
    const staffCount = tenant.staff.length;
    const totalEnergy = tenant.energyLogs.reduce((acc: any, log: any) => acc + log.consumption, 0);

    const responseText = `Hello! Analyzing workspace "${tenant.name}" (${tenant.subdomain}): any students: ${studentCount}, Staff count: ${staffCount}, Energy consumption: ${totalEnergy} kWh. Prompt received: "${prompt}"`;

    return NextResponse.json({ response: responseText });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
