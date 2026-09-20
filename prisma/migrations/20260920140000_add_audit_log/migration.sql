CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userRole" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "allowed" BOOLEAN NOT NULL,
    "errorCode" TEXT,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AuditLog_tenantId_idx"
    ON "AuditLog"("tenantId");

CREATE INDEX "AuditLog_userId_idx"
    ON "AuditLog"("userId");

CREATE INDEX "AuditLog_createdAt_idx"
    ON "AuditLog"("createdAt");

CREATE INDEX "AuditLog_resourceType_resourceId_idx"
    ON "AuditLog"("resourceType", "resourceId");
