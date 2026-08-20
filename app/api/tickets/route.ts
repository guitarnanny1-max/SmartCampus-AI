import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const schoolId = searchParams.get("schoolId");

  if (!schoolId) {
    return NextResponse.json({ error: "Missing schoolId" }, { status: 400 });
  }

  try {
    const alerts = await prisma.alert.findMany({
      where: { schoolId },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(alerts);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { schoolId, title, description, severity } = await request.json();

    if (!schoolId || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newAlert = await prisma.alert.create({
      data: {
        schoolId,
        title,
        message: description || title,
        severity: severity || "MEDIUM"
      }
    });

    return NextResponse.json({ success: true, alert: newAlert });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}
