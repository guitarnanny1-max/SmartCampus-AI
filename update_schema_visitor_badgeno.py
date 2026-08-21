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

# Completely remove any existing VisitorLog definition
schema = re.sub(r'model VisitorLog\s*\{[^}]*\}', '', schema)

# Define the full model with all required visitor log fields including badgeNo
model_def = """
model VisitorLog {
  id           String   @id @default(uuid())
  tenantId     String?
  tenant       Tenant?  @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  schoolId     String?
  school       School?  @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  visitorName  String?  @default("Visitor Name")
  phone        String?  @default("+91 99999 99999")
  email        String?
  hostName     String?  @default("Host Staff")
  purpose      String?  @default("Official Meeting")
  badgeNo      String?  @default("B-001")
  checkIn      String?  @default("10:00 AM")
  checkOut     String?
  status       String   @default("CHECKED_IN")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
"""

schema = schema.strip() + "\n\n" + model_def.strip() + "\n"

# Safely add relations to School and Tenant
for model_name in ["School", "Tenant"]:
    marker = "model " + model_name + " {"
    if marker in schema:
        sub_content = schema.split(marker)[1].split("}")[0]
        if "visitorLogs" not in sub_content:
            parts = schema.split(marker)
            schema = parts[0] + marker + "\n  visitorLogs VisitorLog[]" + parts[1]

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
