import { prisma } from "@/lib/prisma";
export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";




export async function POST(req: any): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { schoolId } = body;

    let school = null;
    if (schoolId) {
      school = await (prisma as any).school.findUnique({
        where: { id: schoolId },
        include: { facilities: true },
      });
    }

    if (!school) {
      school = await (prisma as any).school.findFirst({
        include: { facilities: true },
      });
    }

    if (!school) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, school, auditScore: 94.5 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: any): Promise<NextResponse> {
  try {
    const schools = await (prisma as any).school.findMany({
      include: { facilities: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ schools });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
