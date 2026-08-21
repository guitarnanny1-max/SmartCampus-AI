import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    const password =
      typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0]?.trim() || "127.0.0.1";

    const rateLimitResult = await checkRateLimit(
      `login:${ip}`,
      10,
      60
    );

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error:
            "Too many login attempts during peak traffic. Please wait a moment and try again.",
        },
        { status: 429 }
      );
    }

    // Staff login
    const staff = await prisma.staff.findFirst({
      where: { email },
    });

    if (staff) {
      if (!staff.passwordHash) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      const passwordValid = await bcrypt.compare(
        password,
        staff.passwordHash
      );

      if (!passwordValid) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      const response = NextResponse.json({
        success: true,
        message: "Logged in successfully",
        user: {
          id: staff.id,
          name: staff.name,
          email: staff.email,
          role: staff.role,
          type: "STAFF",
          tenantId: staff.tenantId,
        },
      });

      response.cookies.set("auth_session", staff.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    // Student login
    const student = await prisma.student.findFirst({
      where: { email },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!student.passwordHash) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const passwordValid = await bcrypt.compare(
      password,
      student.passwordHash
    );

    if (!passwordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: student.id,
        name: student.name,
        email: student.email,
        role: "STUDENT",
        type: "STUDENT",
        tenantId: student.tenantId,
      },
    });

    response.cookies.set("auth_session", student.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: unknown) {
    console.error("Login error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
