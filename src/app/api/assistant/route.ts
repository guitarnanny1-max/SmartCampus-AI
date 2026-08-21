import { prisma } from "@/lib/prisma";
export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";




export async function POST(req: any): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { tenantId, prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const tenant = tenantId 
      ? await (prisma as any).tenant.findUnique({ where: { id: tenantId }, include: { students: true, staff: true } })
      : await (prisma as any).tenant.findFirst({ include: { students: true, staff: true } });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant workspace not found" }, { status: 404 });
    }

    const responseText = `AI Assistant (Workspace: ${tenant.name}): any your query successfully. Enrolled students: ${tenant.students.length}, Staff: ${tenant.staff.length}.`;

    const chat = await (prisma as any).aiChat.create({
      data: {
        tenantId: tenant.id,
        prompt,
        response: responseText,
      },
    });

    return NextResponse.json({ success: true, chat, response: responseText }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
