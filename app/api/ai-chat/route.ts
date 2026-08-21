import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";




export async function POST(req: Request) {
  try {
    const { message, subdomain } = await req.json();

    if (!subdomain) {
      return NextResponse.json({ reply: "Please provide a valid school subdomain." }, { status: 400 });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { subdomain },
      include: { students: true, invoices: true }
    });

    if (!tenant) {
      return NextResponse.json({ reply: "School workspace not found." }, { status: 404 });
    }

    // AI Chat response logic based on real tenant telemetry
    let reply = `Hello! I am your AI assistant for ${tenant.name}. How can I assist you today?`;
    
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes("student") || lowerMsg.includes("count")) {
      reply = `We currently have ${tenant.students.length} students enrolled in active records for ${tenant.name}.`;
    } else if (lowerMsg.includes("fee") || lowerMsg.includes("payment")) {
      reply = `Our records show active financial tracking under your tenant plan (${tenant.plan}).`;
    }

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    return NextResponse.json({ reply: "An error occurred processing your request." }, { status: 500 });
  }
}
