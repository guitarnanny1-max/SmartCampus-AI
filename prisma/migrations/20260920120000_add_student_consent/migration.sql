CREATE TABLE "StudentConsent" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "guardianId" TEXT,
    "purpose" TEXT NOT NULL,
    "consentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "privacyNoticeVersion" TEXT NOT NULL,
    "consentedAt" TIMESTAMP(3),
    "withdrawnAt" TIMESTAMP(3),
    "verificationMethod" TEXT,
    "verificationReference" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentConsent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "StudentConsent_tenantId_idx"
    ON "StudentConsent"("tenantId");

CREATE INDEX "StudentConsent_studentId_idx"
    ON "StudentConsent"("studentId");

CREATE INDEX "StudentConsent_guardianId_idx"
    ON "StudentConsent"("guardianId");

CREATE INDEX "StudentConsent_studentId_purpose_idx"
    ON "StudentConsent"("studentId", "purpose");

ALTER TABLE "StudentConsent"
    ADD CONSTRAINT "StudentConsent_tenantId_fkey"
    FOREIGN KEY ("tenantId")
    REFERENCES "Tenant"("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE;

ALTER TABLE "StudentConsent"
    ADD CONSTRAINT "StudentConsent_studentId_fkey"
    FOREIGN KEY ("studentId")
    REFERENCES "Student"("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE;

ALTER TABLE "StudentConsent"
    ADD CONSTRAINT "StudentConsent_guardianId_fkey"
    FOREIGN KEY ("guardianId")
    REFERENCES "student_guardians"("id")
    ON DELETE SET NULL
    ON UPDATE NO ACTION;
