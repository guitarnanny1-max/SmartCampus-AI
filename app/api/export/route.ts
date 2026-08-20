import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const schoolId = searchParams.get("schoolId");

  if (!schoolId) {
    return NextResponse.json({ error: "Missing schoolId" }, { status: 400 });
  }

  try {
    const students = await prisma.student.findMany({
      where: { schoolId }
    });

    // Generate CSV string safely
    const csvRows = [
      ["Name", "Roll Number", "CGPA"],
      ...students.map(s => [s.name, s.rollNo, s.cgpa.toString()])
    ];
    const csvContent = csvRows.map(row => row.join(",")).join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="student-roster-${schoolId}.csv"`
      }
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to generate export" }, { status: 500 });
  }
}
