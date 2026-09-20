import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/src/lib/rateLimit";

export const dynamic = "force-dynamic";

function isBcryptHash(value: string) {
  return /^\$2[aby]\$\d{2}\$/.test(value);
}

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

    const subdomain =
      typeof body.subdomain === "string"
        ? body.subdomain.trim().toLowerCase()
        : "";

    if (!email || !password || !subdomain) {
      return NextResponse.json(
        {
          success: false,
          error: "Email, password, and school subdomain are required",
        },
        { status: 400 }
      );
    }

    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip =
      forwardedFor?.split(",")[0]?.trim() || "127.0.0.1";

    const rateLimitResult = await checkRateLimit(
      `user-login:${ip}`,
      10,
      60
    );

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Too many login attempts. Please wait a moment and try again.",
        },
        { status: 429 }
      );
    }

    const tenant = await prisma.tenant.findUnique({
      where: { subdomain },
      select: {
        id: true,
        name: true,
        status: true,
      },
    });

    if (!tenant) {
      return NextResponse.json(
        {
          success: false,
          error: "School workspace not found",
        },
        { status: 404 }
      );
    }

    if (tenant.status !== "ACTIVE") {
      return NextResponse.json(
        {
          success: false,
          error:
            "This school workspace is not active. Please complete payment or contact your administrator.",
        },
        { status: 403 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        tenantId: tenant.id,
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    let passwordValid = false;

    if (isBcryptHash(user.password)) {
      passwordValid = await bcrypt.compare(
        password,
        user.password
      );
    } else {
      // Backward compatibility for existing development/test users.
      passwordValid = user.password === password;

      // Upgrade legacy plaintext password to bcrypt after
      // successful authentication.
      if (passwordValid) {
        const passwordHash = await bcrypt.hash(password, 12);

        await prisma.user.update({
          where: { id: user.id },
          data: { password: passwordHash },
        });
      }
    }

    if (!passwordValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: tenant.id,
        tenantName: tenant.name,
      },
    });

    response.cookies.set("auth_session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    response.cookies.set("tenant_subdomain", tenant.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: unknown) {
    console.error("User login error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
