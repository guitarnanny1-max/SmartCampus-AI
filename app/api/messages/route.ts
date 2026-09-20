import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import DOMPurify from "isomorphic-dompurify";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 10;

async function getSessionUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("auth_session")?.value;

  if (!sessionId) return null;

  const user = await prisma.user.findUnique({
    where: { id: sessionId },
    select: {
      id: true,
      tenantId: true,
      role: true,
      name: true,
      email: true,
      tenant: {
        select: {
          id: true,
          status: true,
        },
      },
    },
  });

  if (!user || !user.tenant) return null;

  return user;
}

function sanitizeContent(value: string) {
  const raw = typeof value === "string" ? value : "";
  const stripped = raw.replace(/\s+/g, " ").trim();
  const sanitized = DOMPurify.sanitize(stripped, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });

  return sanitized
    .replace(/\[IGNORE PREVIOUS INSTRUCTIONS\]/gi, "")
    .replace(/\{\s*system\s*:/gi, "")
    .replace(/\bignore previous instructions\b/gi, "")
    .trim();
}

async function validateStudentAccess({
  user,
  studentId,
  action,
}: {
  user: NonNullable<Awaited<ReturnType<typeof getSessionUser>>>;
  studentId: string;
  action: "read" | "write";
}) {
  if (user.role !== "PARENT") {
    return { allowed: false, error: "Parent access required" };
  }

  const link = await prisma.parentStudentLink.findFirst({
    where: {
      tenantId: user.tenantId,
      userId: user.id,
      studentId,
    },
    select: {
      id: true,
      guardianId: true,
    },
  });

  if (!link) {
    return { allowed: false, error: "Student not linked to this parent" };
  }

  const consent = await prisma.studentConsent.findFirst({
    where: {
      tenantId: user.tenantId,
      studentId,
      guardianId: link.guardianId ?? undefined,
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      consentStatus: true,
    },
  });

  const consentStatus = consent?.consentStatus?.toUpperCase() ?? "PENDING";
  const allowed = consentStatus === "GRANTED";

  if (!allowed) {
    return {
      allowed: false,
      error: action === "read" ? "Access to this student is not active" : "Consent has not been granted",
    };
  }

  return { allowed: true, error: null };
}

export async function GET(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser();
    const studentId = request.nextUrl.searchParams.get("studentId")?.trim();

    if (!sessionUser) {
      await logAudit({
        tenantId: "unknown",
        userId: "unknown",
        userRole: "anonymous",
        action: "read_messages",
        resourceType: "messages",
        resourceId: studentId || "unknown",
        allowed: false,
        errorCode: "NOT_AUTHENTICATED",
        details: { reason: "missing_session" },
      });
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    if (sessionUser.tenant.status !== "ACTIVE") {
      await logAudit({
        tenantId: sessionUser.tenantId,
        userId: sessionUser.id,
        userRole: sessionUser.role,
        action: "read_messages",
        resourceType: "messages",
        resourceId: studentId || "unknown",
        allowed: false,
        errorCode: "TENANT_INACTIVE",
      });
      return NextResponse.json({ success: false, error: "School workspace is not active" }, { status: 403 });
    }

    if (!studentId) {
      await logAudit({
        tenantId: sessionUser.tenantId,
        userId: sessionUser.id,
        userRole: sessionUser.role,
        action: "read_messages",
        resourceType: "messages",
        resourceId: "unknown",
        allowed: false,
        errorCode: "MISSING_STUDENT_ID",
      });
      return NextResponse.json({ success: false, error: "studentId is required" }, { status: 400 });
    }

    const access = await validateStudentAccess({ user: sessionUser, studentId, action: "read" });
    if (!access.allowed) {
      await logAudit({
        tenantId: sessionUser.tenantId,
        userId: sessionUser.id,
        userRole: sessionUser.role,
        action: "read_messages",
        resourceType: "messages",
        resourceId: studentId,
        allowed: false,
        errorCode: "FORBIDDEN",
        details: { reason: access.error },
      });
      return NextResponse.json({ success: false, error: access.error }, { status: 403 });
    }

    const messages = await prisma.message.findMany({
      where: { tenantId: sessionUser.tenantId },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    const filtered = sessionUser.role === "PARENT"
      ? messages.filter((message) => message.senderName === sessionUser.name || message.senderRole === "ADMIN" || message.senderRole === "SCHOOL_ADMIN")
      : messages;

    const sanitizedMessages = filtered.map((message) => ({
      ...message,
      content: DOMPurify.sanitize(message.content),
    }));

    await logAudit({
      tenantId: sessionUser.tenantId,
      userId: sessionUser.id,
      userRole: sessionUser.role,
      action: "read_messages",
      resourceType: "messages",
      resourceId: studentId,
      allowed: true,
      details: { messageCount: sanitizedMessages.length },
    });

    return NextResponse.json({ success: true, messages: sanitizedMessages });
  } catch (error) {
    console.error("GET /api/messages error:", error);
    return NextResponse.json({ success: false, error: "Unable to load messages" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      await logAudit({
        tenantId: "unknown",
        userId: "unknown",
        userRole: "anonymous",
        action: "write_message",
        resourceType: "messages",
        resourceId: "unknown",
        allowed: false,
        errorCode: "NOT_AUTHENTICATED",
      });
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    if (sessionUser.tenant.status !== "ACTIVE") {
      await logAudit({
        tenantId: sessionUser.tenantId,
        userId: sessionUser.id,
        userRole: sessionUser.role,
        action: "write_message",
        resourceType: "messages",
        resourceId: "unknown",
        allowed: false,
        errorCode: "TENANT_INACTIVE",
      });
      return NextResponse.json({ success: false, error: "School workspace is not active" }, { status: 403 });
    }

    const recent = await prisma.message.count({
      where: {
        tenantId: sessionUser.tenantId,
        senderName: sessionUser.name,
        createdAt: {
          gte: new Date(Date.now() - RATE_LIMIT_WINDOW_MS),
        },
      },
    });

    if (recent >= RATE_LIMIT_MAX) {
      await logAudit({
        tenantId: sessionUser.tenantId,
        userId: sessionUser.id,
        userRole: sessionUser.role,
        action: "write_message",
        resourceType: "messages",
        resourceId: "rate_limited",
        allowed: false,
        errorCode: "RATE_LIMITED",
        details: { windowMs: RATE_LIMIT_WINDOW_MS, max: RATE_LIMIT_MAX },
      });
      return NextResponse.json(
        { success: false, error: "Too many messages. Try again later." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)) } }
      );
    }

    const body = (await request.json()) as { studentId?: string; content?: string };
    const studentId = body.studentId?.trim();
    const rawContent = body.content ?? "";

    if (!studentId) {
      await logAudit({
        tenantId: sessionUser.tenantId,
        userId: sessionUser.id,
        userRole: sessionUser.role,
        action: "write_message",
        resourceType: "messages",
        resourceId: "unknown",
        allowed: false,
        errorCode: "MISSING_STUDENT_ID",
      });
      return NextResponse.json({ success: false, error: "studentId is required" }, { status: 400 });
    }

    const access = await validateStudentAccess({ user: sessionUser, studentId, action: "write" });
    if (!access.allowed) {
      await logAudit({
        tenantId: sessionUser.tenantId,
        userId: sessionUser.id,
        userRole: sessionUser.role,
        action: "write_message",
        resourceType: "messages",
        resourceId: studentId,
        allowed: false,
        errorCode: "FORBIDDEN",
        details: { reason: access.error },
      });
      return NextResponse.json({ success: false, error: access.error }, { status: 403 });
    }

    const sanitizedContent = sanitizeContent(rawContent);
    if (!sanitizedContent) {
      await logAudit({
        tenantId: sessionUser.tenantId,
        userId: sessionUser.id,
        userRole: sessionUser.role,
        action: "write_message",
        resourceType: "messages",
        resourceId: studentId,
        allowed: false,
        errorCode: "EMPTY_CONTENT",
      });
      return NextResponse.json({ success: false, error: "Message content is required" }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        tenantId: sessionUser.tenantId,
        senderName: sessionUser.name,
        senderRole: sessionUser.role,
        content: sanitizedContent,
      },
    });

    await logAudit({
      tenantId: sessionUser.tenantId,
      userId: sessionUser.id,
      userRole: sessionUser.role,
      action: "write_message",
      resourceType: "messages",
      resourceId: studentId,
      allowed: true,
      details: { messageId: message.id },
    });

    return NextResponse.json({ success: true, message: { ...message, content: DOMPurify.sanitize(message.content) } });
  } catch (error) {
    console.error("POST /api/messages error:", error);
    return NextResponse.json({ success: false, error: "Unable to send message" }, { status: 500 });
  }
}
