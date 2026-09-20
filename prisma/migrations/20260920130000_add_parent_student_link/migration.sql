CREATE TABLE "ParentStudentLink" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "guardianId" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParentStudentLink_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ParentStudentLink_user_student_unique"
    ON "ParentStudentLink"("userId", "studentId");

CREATE INDEX "ParentStudentLink_tenantId_idx"
    ON "ParentStudentLink"("tenantId");

CREATE INDEX "ParentStudentLink_userId_idx"
    ON "ParentStudentLink"("userId");

CREATE INDEX "ParentStudentLink_studentId_idx"
    ON "ParentStudentLink"("studentId");

CREATE INDEX "ParentStudentLink_guardianId_idx"
    ON "ParentStudentLink"("guardianId");

ALTER TABLE "ParentStudentLink"
    ADD CONSTRAINT "ParentStudentLink_tenantId_fkey"
    FOREIGN KEY ("tenantId")
    REFERENCES "Tenant"("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE;

ALTER TABLE "ParentStudentLink"
    ADD CONSTRAINT "ParentStudentLink_userId_fkey"
    FOREIGN KEY ("userId")
    REFERENCES "User"("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE;

ALTER TABLE "ParentStudentLink"
    ADD CONSTRAINT "ParentStudentLink_studentId_fkey"
    FOREIGN KEY ("studentId")
    REFERENCES "Student"("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE;

ALTER TABLE "ParentStudentLink"
    ADD CONSTRAINT "ParentStudentLink_guardianId_fkey"
    FOREIGN KEY ("guardianId")
    REFERENCES "student_guardians"("id")
    ON DELETE SET NULL
    ON UPDATE NO ACTION;
