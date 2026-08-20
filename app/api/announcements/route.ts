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
    const announcements = await prisma.announcement.findMany({
      where: { schoolId },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(announcements);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { schoolId, title, content, author } = body;

    if (!schoolId || !title || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newAnnouncement = await prisma.announcement.create({
      data: {
        schoolId,
        title,
        content,
        author: author || "Administrator"
      }
    });

    return NextResponse.json(newAnnouncement, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
  }
}
