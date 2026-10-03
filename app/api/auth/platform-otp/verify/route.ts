import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  verifyOtpHash,
  OTP_MAX_ATTEMPTS,
} from "@/lib/auth/platform-otp";



export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const otp =
      typeof body.otp === "string"
        ? body.otp.trim()
        : "";

    if (!email || !/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { success: false, error: "Enter the 6-digit OTP." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        email,
        isPlatformUser: true,
        authVersion: 2,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid verification request." },
        { status: 401 }
      );
    }

    const otpRecord = await prisma.platformOtp.findFirst({
      where: {
        userId: user.id,
        used: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, error: "OTP not found. Request a new OTP." },
        { status: 400 }
      );
    }

    if (otpRecord.expiresAt <= new Date()) {
      return NextResponse.json(
        { success: false, error: "OTP has expired. Request a new OTP." },
        { status: 400 }
      );
    }

    if (otpRecord.attempts >= OTP_MAX_ATTEMPTS) {
      return NextResponse.json(
        { success: false, error: "Too many attempts. Request a new OTP." },
        { status: 429 }
      );
    }

    const valid = verifyOtpHash(otp, otpRecord.otpHash);

    if (!valid) {
      await prisma.platformOtp.update({
        where: { id: otpRecord.id },
        data: {
          attempts: {
            increment: 1,
          },
        },
      });

      return NextResponse.json(
        { success: false, error: "Invalid OTP." },
        { status: 401 }
      );
    }

    await prisma.platformOtp.update({
      where: { id: otpRecord.id },
      data: {
        used: true,
      },
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPlatformUser: true,
        platformRole: user.platformRole,
      },
    });

    response.cookies.set("auth_session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    response.cookies.set("tenant_subdomain", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Platform OTP verification error:", error);

    return NextResponse.json(
      { success: false, error: "Unable to verify OTP." },
      { status: 500 }
    );
  }
}
