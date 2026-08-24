import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    if (!tenantId) return NextResponse.json({ success: false, payments: [] });
    
    let payments = await prisma.payment.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });

    // Auto-seed starter payment if none exist for this tenant
    if (payments.length === 0) {
      const newPayment = await prisma.payment.create({
        data: {
          tenantId,
          amount: 25000,
          studentName: "Rahul Gupta",
          status: "SUCCESS",
        },
      });
      payments = [newPayment];
    }

    return NextResponse.json({ success: true, payments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { tenantId, amount, studentName } = await request.json();
    if (!tenantId) return NextResponse.json({ success: false, error: "Missing tenantId" }, { status: 400 });

    const payment = await prisma.payment.create({
      data: {
        tenantId,
        amount: Number(amount) || 25000,
        studentName: studentName || "Rahul Gupta",
        status: "SUCCESS",
      },
    });

    return NextResponse.json({ success: true, payment });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
