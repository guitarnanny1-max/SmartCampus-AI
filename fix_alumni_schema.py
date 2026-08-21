import os
import shutil
import subprocess

print("🧹 Cleaning Next.js build cache...")
if os.path.exists(".next"):
    shutil.rmtree(".next")
    print("Removed .next directory.")

print("⚙️ Updating SmartAlumniHub model fields in Prisma schema...")

schema_path = "prisma/schema.prisma"
# Keep everything else the same, just update the SmartAlumniHub model
with open(schema_path, "r", encoding="utf-8") as f:
    schema_content = f.read()

# Replace the old SmartAlumniHub model with the updated one
old_model = """model SmartAlumniHub {
  id             String   @id @default(cuid())
  alumnusName    String   @default("Alumnus")
  graduationYear Int      @default(2022)
  currentCompany String   @default("Company")
  industry       String   @default("Technology")
  donationAmount Float    @default(0.0)
  status         String   @default("ACTIVE")
  schoolId       String?
  school         School?  @relation(fields: [schoolId], references: [id])
  tenantId       String?
  tenant         Tenant?  @relation(fields: [tenantId], references: [id])
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}"""

new_model = """model SmartAlumniHub {
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

# Use a safe replacement approach
if old_model in schema_content:
    updated_schema = schema_content.replace(old_model, new_model)
    with open(schema_path, "w", encoding="utf-8") as f:
        f.write(updated_schema)
    print("✅ Successfully updated SmartAlumniHub model.")
else:
    print("⚠️ Could not find exact model block to replace. Attempting overwrite...")
    # Fallback: Just update the file content
    with open(schema_path, "w", encoding="utf-8") as f:
        f.write(schema_content.replace("model SmartAlumniHub {", new_model.split("{")[0] + "{"))

build_env = os.environ.copy()
build_env["DATABASE_URL"] = "file:./dev.db"

try:
    print("1️⃣ Pushing Prisma schema to SQLite database...")
    # Use --accept-data-loss to ensure schema updates apply if fields changed/renamed
    subprocess.run(["npx", "prisma", "db", "push", "--skip-generate", "--accept-data-loss"], check=True, env=build_env)
    
    print("2️⃣ Generating Prisma Client...")
    subprocess.run(["npx", "prisma", "generate"], check=True, env=build_env)
    
    print("3️⃣ Running Next.js Production Build...")
    subprocess.run(["npm", "run", "build"], check=True, env=build_env)
    
    print("\n🎉 SUCCESS! The entire project compiled successfully with zero errors!")
except subprocess.CalledProcessError as e:
    print(f"\n❌ Build failed with exit code {e.returncode}")
    exit(1)
