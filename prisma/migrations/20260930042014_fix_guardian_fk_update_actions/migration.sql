-- DropForeignKey
ALTER TABLE "ParentStudentLink" DROP CONSTRAINT "ParentStudentLink_guardianId_fkey";

-- DropForeignKey
ALTER TABLE "StudentConsent" DROP CONSTRAINT "StudentConsent_guardianId_fkey";

-- AddForeignKey
ALTER TABLE "ParentStudentLink"
ADD CONSTRAINT "ParentStudentLink_guardianId_fkey"
FOREIGN KEY ("guardianId")
REFERENCES "student_guardians"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentConsent"
ADD CONSTRAINT "StudentConsent_guardianId_fkey"
FOREIGN KEY ("guardianId")
REFERENCES "student_guardians"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;
