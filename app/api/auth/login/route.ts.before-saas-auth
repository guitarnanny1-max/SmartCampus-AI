import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, password, subdomain } = await request.json();
    if (!email || !password || !subdomain) {
      return NextResponse.json({ success: false, error: "Missing email, password, or subdomain" }, { status: 400 });
    }

    let tenant = await prisma.tenant.findUnique({ where: { subdomain } });
    if (!tenant) {
      tenant = await prisma.tenant.create({
        data: { subdomain, name: `${subdomain.toUpperCase()} Public SmartCampus` },
      });
    }

    const userCount = await prisma.user.count({ where: { tenantId: tenant.id } });
    if (userCount === 0) {
      await prisma.user.createMany({
        data: [
          { tenantId: tenant.id, email: `admin@${subdomain}.com`, name: "System Administrator", role: "ADMIN", password: "password123" },
          { tenantId: tenant.id, email: `parent@${subdomain}.com`, name: "Mr. Gupta", role: "PARENT", password: "password123" },
          { tenantId: tenant.id, email: `teacher@${subdomain}.com`, name: "Dr. Sharma", role: "TEACHER", password: "password123" },
          { tenantId: tenant.id, email: `student@${subdomain}.com`, name: "Rahul Gupta", role: "STUDENT", password: "password123" },
        ],
      });
    }

    const user = await prisma.user.findFirst({
      where: { tenantId: tenant.id, email },
    });

    if (!user || user.password !== password) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 });
    }

    return NextResponse.json({ 
      success: true, 
      user: { id: user.id, name: user.name, email: user.email, role: user.role, tenantId: tenant.id } 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
