import subprocess
import os
import shutil
import re

SCHEMA_PATH = "prisma/schema.prisma"
if not os.path.exists(SCHEMA_PATH):
    for root, dirs, files in os.walk("."):
        if "schema.prisma" in files and "node_modules" not in root:
            SCHEMA_PATH = os.path.join(root, "schema.prisma")
            break

print(f"🎯 Target Prisma Schema Path: {SCHEMA_PATH}")

with open(SCHEMA_PATH, "r") as f:
    schema = f.read()

# Completely remove any existing StudentRiskAssessment definition
schema = re.sub(r'model StudentRiskAssessment\s*\{[^}]*\}', '', schema)

# Define the full model with all required student risk fields including rollNo, attendancePct, cgpa
model_def = """
model StudentRiskAssessment {
  id                 String   @id @default(uuid())
  tenantId           String?
  tenant             Tenant?  @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  schoolId           String?
  school             School?  @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  studentName        String?  @default("Student Name")
  studentIdNumber    String?
  rollNo             String?
  riskLevel          String?  @default("MODERATE")
  riskScore          Float?   @default(50.0)
  attendancePct      Float?   @default(85.0)
  cgpa               Float?   @default(3.2)
  riskFactors        String?  @default("Academic tracking indicators")
  aiInterventionPlan String?  @default("Standard Counseling & Tutoring")
  status             String   @default("ACTIVE")
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}
"""

schema = schema.strip() + "\n\n" + model_def.strip() + "\n"

# Safely add relations to School and Tenant
for model_name in ["School", "Tenant"]:
    marker = "model " + model_name + " {"
    if marker in schema:
        sub_content = schema.split(marker)[1].split("}")[0]
        if "studentRiskAssessments" not in sub_content:
            parts = schema.split(marker)
            schema = parts[0] + marker + "\n  studentRiskAssessments StudentRiskAssessment[]" + parts[1]

with open(SCHEMA_PATH, "w") as f:
    f.write(schema)

print("✨ Schema updated successfully!")

# Purge caches
for path in [".next", "node_modules/.prisma", "tsconfig.tsbuildinfo"]:
    if os.path.exists(path):
        if os.path.isdir(path):
            shutil.rmtree(path)
        else:
            os.remove(path)

print("⚙️ Running npx prisma generate...")
subprocess.run(["npx", "prisma", "generate", "--schema=" + SCHEMA_PATH], check=True)

print("🚀 Running npm run build...")
subprocess.run(["npm", "run", "build"], check=True)
print("🎉 Build passed successfully!")
