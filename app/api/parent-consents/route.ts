import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const CONSENT_PURPOSES = new Set([
  "SCHOOL_OPERATIONS",
  "AI_PROCESSING",
  "COMMUNICATIONS",
]);

async function getSessionUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("auth_session")?.value;

  if (!sessionId) return null;

  const user = await prisma.user.findUnique({
    where: { id: sessionId },
    include: { tenant: true },
  });

  if (!user || !user.tenant || user.tenant.status !== "ACTIVE") {
    return null;
  }

  return user;
}

export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    if (user.role !== "PARENT") {
      return NextResponse.json(
        { success: false, error: "Parent access required" },
        { status: 403 }
      );
    }

    const consents = await prisma.studentConsent.findMany({
      where: {
        tenantId: user.tenantId,
        guardian: {
          parent_student_links: {
            some: {
              userId: user.id,
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        studentId: true,
        guardianId: true,
        purpose: true,
        consentStatus: true,
        privacyNoticeVersion: true,
        consentedAt: true,
        withdrawnAt: true,
        verificationMethod: true,
        createdAt: true,
        updatedAt: true,
        student: {
          select: {
            id: true,
            name: true,
            grade: true,
            rollNumber: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      consents,
    });
  } catch (error) {
    console.error("GET /api/parent-consents error:", error);

    return NextResponse.json(
      { success: false, error: "Unable to load consent records" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    if (user.role !== "PARENT") {
      return NextResponse.json(
        { success: false, error: "Parent access required" },
        { status: 403 }
      );
    }

    const body = (await request.json()) as {
      studentId?: string;
      purpose?: string;
      privacyNoticeVersion?: string;
    };

    const studentId = body.studentId?.trim();
    const purpose = body.purpose?.trim();
    const privacyNoticeVersion = body.privacyNoticeVersion?.trim();

    if (!studentId || !purpose || !privacyNoticeVersion) {
      return NextResponse.json(
        {
          success: false,
          error:
            "studentId, purpose and privacyNoticeVersion are required",
        },
        { status: 400 }
      );
    }

    if (!CONSENT_PURPOSES.has(purpose)) {
      return NextResponse.json(
        { success: false, error: "Invalid consent purpose" },
        { status: 400 }
      );
    }

    const link = await prisma.parentStudentLink.findFirst({
      where: {
        tenantId: user.tenantId,
        userId: user.id,
        studentId,
      },
      include: {
        student: true,
        guardian: true,
      },
    });

    if (!link) {
      return NextResponse.json(
        {
          success: false,
          error: "You are not authorized for this student",
        },
        { status: 403 }
      );
    }

    if (!link.guardianId || !link.guardian) {
      return NextResponse.json(
        {
          success: false,
          error: "A verified guardian relationship is required",
        },
        { status: 403 }
      );
    }

    if (
      link.guardian.tenantId !== user.tenantId ||
      link.guardian.student_id !== studentId
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Guardian relationship is invalid",
        },
        { status: 403 }
      );
    }

    const existing = await prisma.studentConsent.findFirst({
      where: {
        tenantId: user.tenantId,
        studentId,
        guardianId: link.guardianId,
        purpose,
      },
    });

    const consent = existing
      ? await prisma.studentConsent.update({
          where: { id: existing.id },
          data: {
            consentStatus: "GRANTED",
            privacyNoticeVersion,
            consentedAt: new Date(),
            withdrawnAt: null,
            verificationMethod: "AUTHENTICATED_PARENT",
            verificationReference: user.id,
          },
        })
      : await prisma.studentConsent.create({
          data: {
            tenantId: user.tenantId,
            studentId,
            guardianId: link.guardianId,
            purpose,
            consentStatus: "GRANTED",
            privacyNoticeVersion,
            consentedAt: new Date(),
            verificationMethod: "AUTHENTICATED_PARENT",
            verificationReference: user.id,
          },
        });

    return NextResponse.json({
      success: true,
      consent,
    });
  } catch (error) {
    console.error("POST /api/parent-consents error:", error);

    return NextResponse.json(
      { success: false, error: "Unable to record consent" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    if (user.role !== "PARENT") {
      return NextResponse.json(
        { success: false, error: "Parent access required" },
        { status: 403 }
      );
    }

    const body = (await request.json()) as {
      studentId?: string;
      purpose?: string;
      action?: string;
    };

    const studentId = body.studentId?.trim();
    const purpose = body.purpose?.trim();

    if (!studentId || !purpose) {
      return NextResponse.json(
        { success: false, error: "studentId and purpose are required" },
        { status: 400 }
      );
    }

    if (!CONSENT_PURPOSES.has(purpose)) {
      return NextResponse.json(
        { success: false, error: "Invalid consent purpose" },
        { status: 400 }
      );
    }

    if (body.action !== "WITHDRAW") {
      return NextResponse.json(
        { success: false, error: "Only WITHDRAW is supported" },
        { status: 400 }
      );
    }

    const link = await prisma.parentStudentLink.findFirst({
      where: {
        tenantId: user.tenantId,
        userId: user.id,
        studentId,
      },
      include: {
        guardian: true,
      },
    });

    if (
      !link ||
      !link.guardianId ||
      !link.guardian ||
      link.guardian.tenantId !== user.tenantId ||
      link.guardian.student_id !== studentId
    ) {
      return NextResponse.json(
        { success: false, error: "You are not authorized for this student" },
        { status: 403 }
      );
    }

    const existing = await prisma.studentConsent.findFirst({
      where: {
        tenantId: user.tenantId,
        studentId,
        guardianId: link.guardianId,
        purpose,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Consent record not found" },
        { status: 404 }
      );
    }

    const consent = await prisma.studentConsent.update({
      where: { id: existing.id },
      data: {
        consentStatus: "WITHDRAWN",
        withdrawnAt: new Date(),
        verificationMethod: "AUTHENTICATED_PARENT_WITHDRAWAL",
        verificationReference: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      consent,
    });
  } catch (error) {
    console.error("PATCH /api/parent-consents error:", error);

    return NextResponse.json(
      { success: false, error: "Unable to withdraw consent" },
      { status: 500 }
    );
  }
}
