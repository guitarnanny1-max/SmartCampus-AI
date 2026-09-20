import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");

    if (!tenantId) {
      return NextResponse.json({
        success: false,
        payments: [],
        error: "Missing tenantId",
      });
    }

    const payments = await prisma.payment.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      payments,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        payments: [],
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { tenantId, amount, studentName } = await request.json();

    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: "Missing tenantId" },
        { status: 400 }
      );
    }

    const normalizedStudentName = String(studentName || "").trim();
    const normalizedAmount = Number(amount);

    if (!normalizedStudentName) {
      return NextResponse.json(
        { success: false, error: "Student name is required" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "Valid payment amount is required" },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.create({
      data: {
        tenantId,
        amount: normalizedAmount,
        studentName: normalizedStudentName,
        status: "SUCCESS",
      },
    });

    return NextResponse.json({
      success: true,
      payment,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
