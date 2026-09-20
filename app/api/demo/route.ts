import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, institutionName, phone, email, board, studentVolume } = body;

    const baseSlug = institutionName
      ? institutionName.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 15)
      : "school";
    
    const subdomain = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;

    const tenant = await prisma.tenant.create({
      data: {
        name: institutionName || "New Institution",
        subdomain,
        contactName: name || "Administrator",
        contactEmail: email || "admin@school.edu.in",
        phone: phone || "Not Provided",
        board: board || "CBSE Board School",
        studentVolume: studentVolume || "500 – 1,500 Students",
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, tenant });
  } catch (error: any) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save lead" },
      { status: 500 }
    );
  }
}
