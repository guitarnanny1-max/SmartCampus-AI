import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";




export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const tenantId = url.searchParams.get("tenantId");

    if (!tenantId) {
      return NextResponse.json({ success: false, error: "Missing tenantId query parameter." }, { status: 400 });
    }

    const announcements = await prisma.announcement.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ success: true, announcements });
  } catch (error: any) {
    console.error("Announcements API Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal server error." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { tenantId, title, content } = await req.json();

    if (!tenantId || !title || !content) {
      return NextResponse.json({ success: false, error: "tenantId, title, and content are required." }, { status: 400 });
    }

    const announcement = await prisma.announcement.create({
      data: {
        tenantId,
        title,
        content
      }
    });

    return NextResponse.json({ success: true, announcement });
  } catch (error: any) {
    console.error("Create Announcement Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal server error." }, { status: 500 });
  }
}
