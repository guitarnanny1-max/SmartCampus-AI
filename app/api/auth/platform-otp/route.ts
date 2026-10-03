import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
  generateOtp,
  hashOtp,
  otpExpiresAt,
} from "@/lib/auth/platform-otp";
import { sendPlatformOtpEmail } from "@/lib/auth/send-platform-otp";



export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
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
        { success: false, error: "Invalid platform credentials." },
        { status: 401 }
      );
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return NextResponse.json(
        { success: false, error: "Invalid platform credentials." },
        { status: 401 }
      );
    }

    await prisma.platformOtp.updateMany({
      where: {
        userId: user.id,
        used: false,
      },
      data: {
        used: true,
      },
    });

    const otp = generateOtp();

    await prisma.platformOtp.create({
      data: {
        userId: user.id,
        otpHash: hashOtp(otp),
        expiresAt: otpExpiresAt(),
      },
    });

    await sendPlatformOtpEmail(user.email, otp);

    return NextResponse.json({
      success: true,
      requiresOtp: true,
      message: "Verification code sent to your email.",
    });
  } catch (error) {
    console.error("Platform OTP request error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to send verification code.",
      },
      { status: 500 }
    );
  }
}
