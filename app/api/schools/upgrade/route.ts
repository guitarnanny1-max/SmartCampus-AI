import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { subdomain, tier } = await request.json();

    if (!subdomain || !tier) {
      return NextResponse.json({ error: "Subdomain and tier are required." }, { status: 400 });
    }

    const updatedSchool = await prisma.school.update({
      where: { subdomain },
      data: {
        subscriptionTier: tier,
        subscriptionStatus: "ACTIVE"
      }
    });

    return NextResponse.json({ success: true, school: updatedSchool }, { status: 200 });
  } catch (err) {
    console.error("Upgrade error:", err);
    return NextResponse.json({ error: "Failed to upgrade subscription." }, { status: 500 });
  }
}
