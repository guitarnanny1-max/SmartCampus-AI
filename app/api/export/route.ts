import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);

  return `"${stringValue.replace(/"/g, '""')}"`;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const tenantId = url.searchParams.get("tenantId");

    if (!tenantId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing tenantId query parameter.",
        },
        { status: 400 },
      );
    }

    const students = await prisma.student.findMany({
      where: {
        tenantId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const csvHeader =
      "ID,AdmissionNumber,Name,Grade,GuardianName,Phone,Email,Status,FeeStatus\n";

    const csvRows = students
      .map((student) =>
        [
          student.id,
          student.admissionNumber,
          student.name,
          student.grade,
          student.guardianName,
          student.phone,
          student.email,
          student.status,
          student.feeStatus,
        ]
          .map(escapeCsv)
          .join(","),
      )
      .join("\n");

    const csvString = csvHeader + csvRows;

    return new NextResponse(csvString, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition":
          'attachment; filename="students-export.csv"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Export API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Internal server error.",
      },
      { status: 500 },
    );
  }
}
