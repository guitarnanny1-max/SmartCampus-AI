import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // Development-only bridge. Production must use OAuth/MCP authentication.
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { success: false, error: "Development MCP bridge disabled in production" },
      { status: 404 }
    );
  }

  const expectedSecret = process.env.MCP_DEV_SECRET;
  const configuredEmail = process.env.MCP_DEV_USER_EMAIL;

  if (!expectedSecret || !configuredEmail) {
    return NextResponse.json(
      { success: false, error: "MCP development configuration missing" },
      { status: 500 }
    );
  }

  const authorization = request.headers.get("authorization") || "";
  const [scheme, suppliedSecret] = authorization.split(" ");

  if (scheme !== "Bearer" || !suppliedSecret || suppliedSecret !== expectedSecret) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findFirst({
    where: {
      email: configuredEmail,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      tenantId: true,
      tenant: {
        select: {
          id: true,
          name: true,
          subdomain: true,
          status: true,
        },
      },
    },
  });

  if (!user || !user.tenant) {
    return NextResponse.json(
      { success: false, error: "Configured MCP development user not found" },
      { status: 404 }
    );
  }

  if (user.tenant.status !== "ACTIVE") {
    return NextResponse.json(
      { success: false, error: "Tenant is not active" },
      { status: 403 }
    );
  }

  return NextResponse.json({
    success: true,
    authenticated: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    tenant: {
      id: user.tenant.id,
      name: user.tenant.name,
      subdomain: user.tenant.subdomain,
    },
    environment: "development",
  });
}
