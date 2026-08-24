import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subdomain = searchParams.get("subdomain");
    if (!subdomain) return NextResponse.json({ tenantId: null }, { status: 400 });

    const tenant = await prisma.tenant.upsert({
      where: { subdomain },
      update: {},
      create: {
        subdomain,
        name: `${subdomain.toUpperCase()} Public SmartCampus`,
      },
    });

    // Automatically seed sample payment if empty
    const pCount = await prisma.payment.count({ where: { tenantId: tenant.id } });
    if (pCount === 0) {
      await prisma.payment.create({
        data: {
          tenantId: tenant.id,
          amount: 25000,
          studentName: "Rahul Gupta",
          status: "SUCCESS",
        },
      });
    }

    // Automatically seed sample message if empty
    const mCount = await prisma.message.count({ where: { tenantId: tenant.id } });
    if (mCount === 0) {
      await prisma.message.create({
        data: {
          tenantId: tenant.id,
          senderName: "Mr. Gupta (Parent)",
          senderRole: "PARENT",
          content: "Hello Dr. Sharma, Q2 tuition fee has been paid successfully via Razorpay.",
        },
      });
    }

    // Automatically seed sample attendance if empty
    const aCount = await prisma.attendance.count({ where: { tenantId: tenant.id } });
    if (aCount === 0) {
      await prisma.attendance.create({
        data: {
          tenantId: tenant.id,
          studentName: "Rahul Gupta",
          date: "2026-08-24",
          status: "PRESENT",
          punchTime: "08:15 AM",
        },
      });
    }

    return NextResponse.json({ tenantId: tenant.id });
  } catch (error: any) {
    return NextResponse.json({ tenantId: null, error: error.message }, { status: 500 });
  }
}
