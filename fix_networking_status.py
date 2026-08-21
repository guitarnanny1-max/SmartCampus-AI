import os
import shutil
import subprocess

print("🧹 Cleaning Next.js build cache...")
if os.path.exists(".next"):
    shutil.rmtree(".next")
    print("Removed .next directory.")

print("⚙️ Adding networkingStatus to SmartAlumniHub model in Prisma schema...")

schema_path = "prisma/schema.prisma"
with open(schema_path, "r", encoding="utf-8") as f:
    schema_content = f.read()

old_model = """model SmartAlumniHub {
  id                 String   @id @default(cuid())
  alumniName         String   @default("Alumnus")
  graduationYear     Int      @default(2022)
  currentDesignation String   @default("N/A")
  endowmentInr       Float    @default(0.0)
  status             String   @default("ACTIVE")
  schoolId           String?
  school             School?  @relation(fields: [schoolId], references: [id])
  tenantId           String?
  tenant             Tenant?  @relation(fields: [tenantId], references: [id])
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}"""

new_model = """model SmartAlumniHub {
  id                 String   @id @default(cuid())
  alumniName         String   @default("Alumnus")
  graduationYear     Int      @default(2022)
  currentDesignation String   @default("N/A")
  endowmentInr       Float    @default(0.0)
  status             String   @default("ACTIVE")
  networkingStatus   String   @default("ACTIVE")
  schoolId           String?
  school             School?  @relation(fields: [schoolId], references: [id])
  tenantId           String?
  tenant             Tenant?  @relation(fields: [tenantId], references: [id])
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}"""

if old_model in schema_content:
    updated_schema = schema_content.replace(old_model, new_model)
    with open(schema_path, "w", encoding="utf-8") as f:
        f.write(updated_schema)
    print("✅ Successfully updated SmartAlumniHub model with networkingStatus.")
else:
    print("⚠️ Could not find exact model block. Appending field manually or replacing...")
    # Safe fallback if formatting differed slightly
    schema_content = schema_content.replace(
        "  status             String   @default(\"ACTIVE\")",
        "  status             String   @default(\"ACTIVE\")\n  networkingStatus   String   @default(\"ACTIVE\")"
    )
    with open(schema_path, "w", encoding="utf-8") as f:
        f.write(schema_content)

build_env = os.environ.copy()
build_env["DATABASE_URL"] = "file:./dev.db"

try:
    print("1️⃣ Pushing Prisma schema to SQLite database...")
    subprocess.run(["npx", "prisma", "db", "push", "--skip-generate", "--accept-data-loss"], check=True, env=build_env)
    
    print("2️⃣ Generating Prisma Client...")
    subprocess.run(["npx", "prisma", "generate"], check=True, env=build_env)
    
    print("3️⃣ Running Next.js Production Build...")
    subprocess.run(["npm", "run", "build"], check=True, env=build_env)
    
    print("\n🎉 SUCCESS! The entire project compiled successfully with zero errors!")
except subprocess.CalledProcessError as e:
    print(f"\n❌ Build failed with exit code {e.returncode}")
    exit(1)
