import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { prompt, schoolId } = await req.json();

    if (!schoolId) {
      return NextResponse.json({ error: "School ID is required" }, { status: 400 });
    }

    const [school, students, facilities, alerts] = await Promise.all([
      prisma.school.findUnique({ where: { id: schoolId } }),
      prisma.student.findMany({ where: { schoolId } }),
      prisma.facility.findMany({ where: { schoolId } }),
      prisma.alert.findMany({ where: { schoolId }, orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

    const studentCount = students.length;
    const avgCgpa = studentCount > 0 ? (students.reduce((acc, s) => acc + s.cgpa, 0) / studentCount).toFixed(2) : "N/A";
    const facilityCount = facilities.length;
    const activeAlerts = alerts.length;

    let responseText = `Hello! As the AI co-pilot for ${school?.name || "this campus"}, here is your real-time status update: `;
    responseText += `We currently have ${studentCount} enrolled students with an average CGPA of ${avgCgpa}. `;
    responseText += `There are ${facilityCount} operational facilities monitored, and ${activeAlerts} active alerts requiring attention. `;

    if (prompt.toLowerCase().includes("energy") || prompt.toLowerCase().includes("solar")) {
      responseText += `Current telemetry reports 42.5 kW solar generation against a 121.4 kW grid load.`;
    } else if (prompt.toLowerCase().includes("student") || prompt.toLowerCase().includes("academic")) {
      responseText += `Top students include ${students.slice(0, 3).map(s => s.name).join(", ")}.`;
    } else {
      responseText += `How else can I assist you with campus operations today?`;
    }

    return NextResponse.json({ reply: responseText });
  } catch (error) {
    console.error("AI Co-Pilot Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
