import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getSessionUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("auth_session")?.value;

  if (!sessionId) return null;

  const user = await prisma.user.findUnique({
    where: { id: sessionId },
    select: {
      id: true,
      tenantId: true,
      role: true,
      name: true,
      email: true,
    },
  });

  if (!user) return null;

  return user;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    if (user.role !== "ADMIN" && user.role !== "SCHOOL_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const studentId = searchParams.get("studentId")?.trim();
    const resourceType = searchParams.get("resourceType")?.trim();
    const userId = searchParams.get("userId")?.trim();
    const days = Number(searchParams.get("days") ?? "30");

    const since = new Date(Date.now() - Math.max(days, 1) * 24 * 60 * 60 * 1000);

    const where: Record<string, unknown> = {
      tenantId: user.tenantId,
      createdAt: { gte: since },
    };

    if (studentId) {
      where.details = { path: ["studentId"], equals: studentId };
    }

    if (resourceType) {
      where.resourceType = resourceType;
    }

    if (userId) {
      where.userId = userId;
    }

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return NextResponse.json({ success: true, logs });
  } catch (error) {
    console.error("GET /api/admin/audit-logs error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to load audit logs" },
      { status: 500 }
    );
  }
}
