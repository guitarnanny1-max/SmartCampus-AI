import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getCurrentSchool } from "@/lib/current-school";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const headerList = await headers();
    const userRole = headerList.get("x-user-role") || "TENANT_ADMIN";

    if (userRole === "VIEWER") {
      return NextResponse.json(
        { error: "Permission denied: VIEWER cannot modify tenant settings" },
        { status: 403 }
      );
    }

    const school = await getCurrentSchool();
    const body = await req.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const logoUrl =
      typeof body.logoUrl === "string" ? body.logoUrl.trim() : "";

    if (!name) {
      return NextResponse.json(
        { error: "Institution name is required" },
        { status: 400 }
      );
    }

    const updatedSchool = await prisma.school.update({
      where: {
        id: school.id,
      },
      data: {
        name,
        ...(logoUrl ? { logoUrl } : {}),
      },
    });

    return NextResponse.json(updatedSchool);
  } catch (error) {
    console.error("Tenant settings POST error:", error);

    return NextResponse.json(
      { error: "Failed to update tenant settings" },
      { status: 500 }
    );
  }
}
