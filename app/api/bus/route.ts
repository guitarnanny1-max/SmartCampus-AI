import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    if (!tenantId) return NextResponse.json({ success: false, bus: null });

    let bus = await prisma.busLocation.findFirst({
      where: { tenantId },
    });

    if (!bus) {
      bus = await prisma.busLocation.create({
        data: {
          tenantId,
          busNumber: "Bus #4 (Route A)",
          latitude: 28.6139,
          longitude: 77.2090,
          speed: "42 km/h",
          status: "On Time - 8 mins to Campus",
        },
      });
    }

    return NextResponse.json({ success: true, bus });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { tenantId, status, speed } = await request.json();
    if (!tenantId) return NextResponse.json({ success: false, error: "Missing tenantId" }, { status: 400 });

    const bus = await prisma.busLocation.findFirst({ where: { tenantId } });
    if (!bus) {
      return NextResponse.json({ success: false, error: "Bus not found" }, { status: 404 });
    }

    const updated = await prisma.busLocation.update({
      where: { id: bus.id },
      data: { status: status || bus.status, speed: speed || bus.speed },
    });

    return NextResponse.json({ success: true, updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
