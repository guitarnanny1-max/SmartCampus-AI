import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message) return NextResponse.json({ error: "Message required" }, { status: 400 });

    const query = message.toLowerCase();
    let reply = "I am your Smart Campus AI assistant. I can help you check students, staff, exams, library assets, or energy logs.";

    if (query.includes("student") || query.includes("enroll")) {
      const count = await prisma.student.count();
      const recent = await prisma.student.findFirst({ orderBy: { createdAt: "desc" } });
      reply = `There are currently ${count} students enrolled in the system.${recent ? " Most recent registration: " + recent.name + " (" + recent.grade + ")" : ""}`;
    } else if (query.includes("staff") || query.includes("teacher")) {
      const count = await prisma.staff.count();
      reply = `There are ${count} active staff members registered on campus.`;
    } else if (query.includes("energy") || query.includes("power")) {
      const logs = await prisma.energyLog.findMany({ take: 5, orderBy: { createdAt: "desc" } });
      const totalCost = logs.reduce((acc, l) => acc + (l.cost || 0), 0);
      reply = `Latest campus energy telemetry shows ${logs.length} recent logs recorded. Total recent cost tracked: $${totalCost.toFixed(2)}.`;
    } else if (query.includes("exam") || query.includes("test")) {
      const exams = await prisma.exam.findMany({ take: 3, orderBy: { date: "asc" } });
      reply = exams.length > 0 
        ? `Upcoming exams: ${exams.map(e => e.title + " (" + e.subject + " on " + new Date(e.date).toLocaleDateString() + ")").join(", ")}`
        : "No upcoming exams found in the schedule.";
    } else if (query.includes("library") || query.includes("book")) {
      const count = await prisma.libraryAsset.count();
      reply = `The campus library currently manages ${count} cataloged assets and books.`;
    }

    return NextResponse.json({ reply });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
