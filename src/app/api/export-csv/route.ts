import { prisma } from "@/lib/prisma";
export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";




export async function GET(req: any): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "students";
    const tenantId = searchParams.get("tenantId");

    const tenant = tenantId 
      ? await (prisma as any).tenant.findUnique({ where: { id: tenantId } })
      : await (prisma as any).tenant.findFirst();

    if (!tenant) {
      return NextResponse.json({ error: "Tenant workspace not found" }, { status: 404 });
    }

    let csvContent = "";
    let filename = `${tenant.subdomain}-export.csv`;

    if (type === "students") {
      const students = await (prisma as any).student.findMany({
        where: { tenantId: tenant.id },
      });
      filename = `${tenant.subdomain}-students-export.csv`;
      csvContent = "Name,AdmissionNumber,Grade,Status\n" + 
        students.map((s: any) => `"${s.name}","${s.admissionNumber}","${s.grade}","${s.status}"`).join("\n");
    } else if (type === "staff") {
      const staffList = await (prisma as any).staff.findMany({
        where: { tenantId: tenant.id },
      });
      filename = `${tenant.subdomain}-staff-export.csv`;
      csvContent = "Name,Role,Email\n" + 
        staffList.map((st: any) => `"${st.name}","${st.role}","${st.email || ""}"`).join("\n");
    } else {
      csvContent = "ID,TenantId,CreatedAt\n" + `"${tenant.id}","${tenant.subdomain}","${tenant.createdAt}"`;
    }

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
