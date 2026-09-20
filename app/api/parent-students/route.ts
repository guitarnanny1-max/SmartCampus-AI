import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type LinkBody = {
  parentUserId?: string;
  studentId?: string;
  guardianId?: string;
  isPrimary?: boolean;
};

async function getSessionUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("auth_session")?.value;

  if (!sessionId) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: sessionId },
    select: {
      id: true,
      tenantId: true,
      role: true,
      email: true,
      name: true,
      tenant: {
        select: {
          id: true,
          status: true,
        },
      },
    },
  });
}

export async function GET() {
  try {
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    if (sessionUser.tenant.status !== "ACTIVE") {
      return NextResponse.json(
        { success: false, error: "School workspace is not active" },
        { status: 403 }
      );
    }

    if (sessionUser.role !== "PARENT") {
      return NextResponse.json(
        { success: false, error: "Parent access required" },
        { status: 403 }
      );
    }

    const links = await prisma.parentStudentLink.findMany({
      where: {
        tenantId: sessionUser.tenantId,
        userId: sessionUser.id,
      },
      orderBy: [
        { isPrimary: "desc" },
        { createdAt: "asc" },
      ],
      include: {
        student: {
          select: {
            id: true,
            name: true,
            grade: true,
            rollNumber: true,
            status: true,
          },
        },
        guardian: {
          select: {
            id: true,
            name: true,
            relationship: true,
            email: true,
            phone: true,
            is_primary: true,
          },
        },
      },
    });

    const studentIds = links.map((link) => link.student.id);

    const [attendanceRecords, feeRecords, paymentRecords] =
      await Promise.all([
        prisma.attendance.findMany({
          where: {
            tenantId: sessionUser.tenantId,
            studentId: { in: studentIds },
          },
          orderBy: { date: "desc" },
          select: {
            id: true,
            studentId: true,
            date: true,
            status: true,
            punchTime: true,
          },
        }),

        prisma.student_fees.findMany({
          where: {
            tenantId: sessionUser.tenantId,
            student_id: { in: studentIds },
          },
          orderBy: { due_date: "asc" },
          select: {
            id: true,
            student_id: true,
            amount: true,
            discount_amount: true,
            net_amount: true,
            due_date: true,
            status: true,
            remarks: true,
            fee_types: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        }),

        prisma.fee_payments.findMany({
          where: {
            tenantId: sessionUser.tenantId,
            student_id: { in: studentIds },
          },
          orderBy: { payment_date: "desc" },
          select: {
            id: true,
            student_id: true,
            payment_date: true,
            amount: true,
            payment_method: true,
            transaction_reference: true,
            status: true,
            remarks: true,
          },
        }),
      ]);

    const students = links.map((link) => {
      const studentId = link.student.id;

      const attendance = attendanceRecords
        .filter((record) => record.studentId === studentId)
        .map((record) => ({
          id: record.id,
          date: record.date,
          status: record.status,
          punchTime: record.punchTime,
        }));

      const fees = feeRecords
        .filter((record) => record.student_id === studentId)
        .map((record) => ({
          id: record.id,
          amount: Number(record.amount),
          discountAmount: Number(record.discount_amount),
          netAmount: Number(record.net_amount),
          dueDate: record.due_date,
          status: record.status,
          remarks: record.remarks,
          feeType: record.fee_types
            ? {
                id: record.fee_types.id,
                name: record.fee_types.name,
              }
            : null,
        }));

      const payments = paymentRecords
        .filter((record) => record.student_id === studentId)
        .map((record) => ({
          id: record.id,
          paymentDate: record.payment_date,
          amount: Number(record.amount),
          paymentMethod: record.payment_method,
          transactionReference: record.transaction_reference,
          status: record.status,
          remarks: record.remarks,
        }));

      const presentCount = attendance.filter(
        (record) => record.status.toUpperCase() === "PRESENT"
      ).length;

      const absentCount = attendance.filter(
        (record) => record.status.toUpperCase() === "ABSENT"
      ).length;

      const attendanceRate =
        attendance.length > 0
          ? Math.round((presentCount / attendance.length) * 100)
          : null;

      const totalBilled = fees.reduce(
        (sum, record) => sum + record.netAmount,
        0
      );

      const totalPaid = payments
        .filter((record) =>
          ["COMPLETED", "SUCCESS", "PAID"].includes(
            record.status.toUpperCase()
          )
        )
        .reduce((sum, record) => sum + record.amount, 0);

      return {
        linkId: link.id,
        isPrimary: link.isPrimary,
        student: link.student,
        guardian: link.guardian,
        attendance: {
          totalRecords: attendance.length,
          presentCount,
          absentCount,
          rate: attendanceRate,
          recent: attendance,
        },
        fees: {
          recordCount: fees.length,
          totalBilled,
          totalPaid,
          outstanding: Math.max(totalBilled - totalPaid, 0),
          records: fees,
        },
        payments: {
          recordCount: payments.length,
          totalPaid,
          records: payments,
        },
      };
    });

    await logAudit({
      tenantId: sessionUser.tenantId,
      userId: sessionUser.id,
      userRole: sessionUser.role,
      action: "read_students",
      resourceType: "parent_students",
      resourceId: sessionUser.id,
      allowed: true,
      details: {
        studentCount: students.length,
        studentIds: students.map((student) => student.student.id),
      },
    });

    return NextResponse.json({
      success: true,
      students,
    });
  } catch (error) {
    console.error("PARENT STUDENTS GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load linked students",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    if (sessionUser.tenant.status !== "ACTIVE") {
      return NextResponse.json(
        { success: false, error: "School workspace is not active" },
        { status: 403 }
      );
    }

    if (
      sessionUser.role !== "SCHOOL_ADMIN" &&
      sessionUser.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { success: false, error: "Only school administrators can create parent links" },
        { status: 403 }
      );
    }

    const body = (await request.json()) as LinkBody;

    const parentUserId = body.parentUserId?.trim();
    const studentId = body.studentId?.trim();
    const guardianId = body.guardianId?.trim();

    if (!parentUserId || !studentId) {
      return NextResponse.json(
        {
          success: false,
          error: "parentUserId and studentId are required",
        },
        { status: 400 }
      );
    }

    const parentUser = await prisma.user.findFirst({
      where: {
        id: parentUserId,
        tenantId: sessionUser.tenantId,
        role: "PARENT",
        isPlatformUser: false,
      },
      select: {
        id: true,
        tenantId: true,
        role: true,
      },
    });

    if (!parentUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Parent user was not found in this school",
        },
        { status: 404 }
      );
    }

    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        tenantId: sessionUser.tenantId,
      },
      select: {
        id: true,
        tenantId: true,
        name: true,
        status: true,
      },
    });

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          error: "Student was not found in this school",
        },
        { status: 404 }
      );
    }

    if (student.status !== "ACTIVE") {
      return NextResponse.json(
        {
          success: false,
          error: "Only active students can be linked",
        },
        { status: 400 }
      );
    }

    let guardian = null;

    if (guardianId) {
      guardian = await prisma.student_guardians.findFirst({
        where: {
          id: guardianId,
          tenantId: sessionUser.tenantId,
          student_id: student.id,
        },
        select: {
          id: true,
          tenantId: true,
          student_id: true,
          name: true,
          relationship: true,
          email: true,
          phone: true,
          is_primary: true,
        },
      });

      if (!guardian) {
        return NextResponse.json(
          {
            success: false,
            error: "Guardian does not belong to this student",
          },
          { status: 400 }
        );
      }
    }

    const existingLink = await prisma.parentStudentLink.findUnique({
      where: {
        userId_studentId: {
          userId: parentUser.id,
          studentId: student.id,
        },
      },
    });

    if (existingLink) {
      return NextResponse.json(
        {
          success: false,
          error: "This parent is already linked to this student",
          link: existingLink,
        },
        { status: 409 }
      );
    }

    const link = await prisma.parentStudentLink.create({
      data: {
        id: crypto.randomUUID(),
        tenantId: sessionUser.tenantId,
        userId: parentUser.id,
        studentId: student.id,
        guardianId: guardian?.id ?? null,
        isPrimary: body.isPrimary !== false,
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            grade: true,
            rollNumber: true,
          },
        },
        guardian: {
          select: {
            id: true,
            name: true,
            relationship: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      link,
    });
  } catch (error) {
    console.error("PARENT STUDENT LINK ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to create parent-student link",
      },
      { status: 500 }
    );
  }
}
