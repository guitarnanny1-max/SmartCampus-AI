import { prisma } from "@/lib/prisma";

export type AuditLogInput = {
  tenantId: string;
  userId: string;
  userRole: string;
  action: string;
  resourceType: string;
  resourceId: string;
  allowed: boolean;
  errorCode?: string | null;
  details?: Record<string, unknown> | null;
};

export async function logAudit({
  tenantId,
  userId,
  userRole,
  action,
  resourceType,
  resourceId,
  allowed,
  errorCode,
  details,
}: AuditLogInput) {
  try {
    await prisma.auditLog.create({
      data: {
        tenantId,
        userId,
        userRole,
        action,
        resourceType,
        resourceId,
        allowed,
        errorCode: errorCode ?? null,
        details: details ?? undefined,
      },
    });
  } catch (error) {
    console.error("Audit log write failed:", error);
  }
}
