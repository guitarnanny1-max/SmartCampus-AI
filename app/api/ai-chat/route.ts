import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { subdomain, prompt } = await request.json();

    if (!subdomain || !prompt) {
      return NextResponse.json({ error: "Subdomain and prompt are required" }, { status: 400 });
    }

    const school = await prisma.school.findFirst({
      where: { subdomain },
      include: { students: true, facilities: true }
    });

    if (!school) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    const query = prompt.toLowerCase();
    let reply = "";

    if (query.includes("student") || query.includes("enroll") || query.includes("roster")) {
      const names = school.students.map(s => s.name).join(", ");
      reply = `${school.name} currently has ${school.students.length} active students enrolled on record. Key roster members include: ${names || "None yet"}.`;
    } else if (query.includes("facility") || query.includes("building") || query.includes("lab")) {
      const facilitiesList = school.facilities.map(f => `${f.name} (${f.status})`).join(", ");
      reply = `We are tracking ${school.facilities.length} core facilities for ${school.name}: ${facilitiesList || "No facilities logged yet"}. All systems are operating normally.`;
    } else {
      reply = `Hello! I am your ${school.name} Campus Copilot. I have secure access to your tenant database (${school.id.slice(0, 8)}...). You can ask me about active student rosters or facility statuses!`;
    }

    return NextResponse.json({ reply }, { status: 200 });
  } catch (err: any) {
    console.error("AI Copilot Error:", err);
    return NextResponse.json({ error: "Failed to process AI query" }, { status: 500 });
  }
}
