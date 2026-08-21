import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";




export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const tenantId = url.searchParams.get("tenantId");

    if (!tenantId) {
      return NextResponse.json({ success: false, error: "Missing tenantId query parameter." }, { status: 400 });
    }

    const alerts = await prisma.alert.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ success: true, alerts });
  } catch (error: any) {
    console.error("Tickets/Alerts API Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal server error." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { tenantId, title, message } = await req.json();

    if (!tenantId || !title || !message) {
      return NextResponse.json({ success: false, error: "tenantId, title, and message are required." }, { status: 400 });
    }

    const alert = await prisma.alert.create({
      data: {
        tenantId,
        title,
        message
      }
    });

    return NextResponse.json({ success: true, alert });
  } catch (error: any) {
    console.error("Create Alert Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal server error." }, { status: 500 });
  }
}
