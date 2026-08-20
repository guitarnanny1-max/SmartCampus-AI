import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { subdomain, prompt } = await req.json();

    if (!subdomain || !prompt) {
      return NextResponse.json({ error: "Missing subdomain or prompt" }, { status: 400 });
    }

    // Fetch tenant data including fees and staff relations
    const school = await prisma.school.findFirst({
      where: { subdomain },
      include: { students: true, facilities: true, tickets: true, staff: true, fees: true }
    });

    if (!school) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    const lowerPrompt = prompt.toLowerCase();
    let reply = "";

    // Context-aware natural language processing logic
    if (lowerPrompt.includes("student") || lowerPrompt.includes("cgpa") || lowerPrompt.includes("roster")) {
      const avgCgpa = school.students.length > 0 
        ? (school.students.reduce((acc, s) => acc + s.cgpa, 0) / school.students.length).toFixed(2)
        : "0.00";
      reply = `[AI Copilot]: ${school.name} currently has ${school.students.length} enrolled student(s) with an average institutional CGPA of ${avgCgpa}.`;
    } else if (lowerPrompt.includes("fee") || lowerPrompt.includes("due") || lowerPrompt.includes("payment") || lowerPrompt.includes("ledger") || lowerPrompt.includes("collected")) {
      const totalCollected = school.fees.filter(f => f.status === "PAID").reduce((acc, f) => acc + f.amount, 0);
      const totalPending = school.fees.filter(f => f.status === "PENDING").reduce((acc, f) => acc + f.amount, 0);
      reply = `[AI Copilot]: Fee Ledger telemetry for ${school.name}: ₹${totalCollected.toLocaleString('en-IN')} collected, with ₹${totalPending.toLocaleString('en-IN')} pending across ${school.fees.length} total invoice(s).`;
    } else if (lowerPrompt.includes("facility") || lowerPrompt.includes("lab") || lowerPrompt.includes("equipment")) {
      const maintenanceNeeded = school.facilities.filter(f => f.status === "Maintenance Required").length;
      reply = `[AI Copilot]: Monitoring ${school.facilities.length} campus facility/facilities. Status check: ${maintenanceNeeded} currently require maintenance attention.`;
    } else if (lowerPrompt.includes("ticket") || lowerPrompt.includes("issue") || lowerPrompt.includes("repair")) {
      const highSeverity = school.tickets.filter(t => t.severity === "HIGH").length;
      reply = `[AI Copilot]: There are ${school.tickets.length} total support ticket(s) logged, with ${highSeverity} marked as high/urgent priority.`;
    } else if (lowerPrompt.includes("staff") || lowerPrompt.includes("teacher")) {
      reply = `[AI Copilot]: There are ${school.staff.length} staff member(s) registered on your institutional roster.`;
    } else if (lowerPrompt.includes("subscription") || lowerPrompt.includes("tier") || lowerPrompt.includes("plan")) {
      reply = `[AI Copilot]: You are currently on the ${school.subscriptionTier} plan with subscription status set to ${school.subscriptionStatus}.`;
    } else {
      reply = `[AI Copilot]: Hello Administrator! I analyzed live data for ${school.name}: ${school.students.length} students, ${school.staff.length} staff, and ₹${school.fees.filter(f => f.status === "PENDING").reduce((acc,f)=>acc+f.amount,0).toLocaleString('en-IN')} pending fee dues. Ask me about student rosters, fee collection, facility health, or maintenance tickets!`;
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("AI Copilot Error:", error);
    return NextResponse.json({ error: "Failed to process AI query" }, { status: 500 });
  }
}
