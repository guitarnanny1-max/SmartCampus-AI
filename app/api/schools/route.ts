import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST: Provision new tenant
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, subdomain, primaryColor, subscriptionTier } = body;

    if (!name || !subdomain) {
      return NextResponse.json({ error: "School name and subdomain are required." }, { status: 400 });
    }

    const existing = await prisma.school.findFirst({ where: { subdomain } });
    if (existing) {
      return NextResponse.json({ error: "Subdomain already taken." }, { status: 400 });
    }

    const newSchool = await prisma.school.create({
      data: {
        name,
        subdomain,
        primaryColor: primaryColor || "#2563eb",
        subscriptionTier: subscriptionTier || "TRIAL",
        subscriptionStatus: "ACTIVE",
        students: { create: [{ name: "Aarav Sharma", rollNo: "SC-001", cgpa: 9.2 }] },
        facilities: { create: [{ name: "Main Lab", type: "IT", status: "Operational" }] }
      }
    });

    return NextResponse.json({ success: true, school: newSchool }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

// DELETE: Offboard tenant
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await prisma.school.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete tenant." }, { status: 500 });
  }
}
