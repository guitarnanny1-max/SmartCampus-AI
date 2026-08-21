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

def update_schema():
    if not os.path.exists(SCHEMA_PATH):
        print(f"❌ Error: {SCHEMA_PATH} not found anywhere.")
        return False

    with open(SCHEMA_PATH, "r") as f:
        schema = f.read()

    # Define SmartStudentResume model with projects and atsScore included
    model_def = """model SmartStudentResume {
  id                 String   @id @default(uuid())
  tenantId           String?
  tenant             Tenant?  @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  schoolId           String?
  school             School?  @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  studentName        String?
  studentEmail       String?
  rollNumber         String?
  targetRole         String?
  gpa                Float    @default(8.5)
  skills             String?  @default("React, TypeScript, Python")
  projects           String?  @default("Enterprise Campus Operating System")
  resumeTitle        String?
  aiScore            Float    @default(85.0)
  atsCompatibility   Float    @default(90.0)
  atsScore           Float    @default(90.0)
  status             String   @default("ACTIVE")
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}"""

    # Remove old definition if it exists
    schema = re.sub(r'model SmartStudentResume\s*\{[^}]*\}', '', schema)
    schema += "\n\n" + model_def

    # Ensure relations exist on School
    if "model School" in schema:
        school_match = re.search(r"model School\s*\{([^}]*)\}", schema)
        if school_match:
            school_body = school_match.group(1)
            if "smartStudentResumes" not in school_body:
                new_school_body = school_body.rstrip() + "\n  smartStudentResumes SmartStudentResume[]\n"
                schema = schema.replace(school_match.group(0), f"model School {{{new_school_body}}}")

    # Ensure relations exist on Tenant
    if "model Tenant" in schema:
        tenant_match = re.search(r"model Tenant\s*\{([^}]*)\}", schema)
        if tenant_match:
            tenant_body = tenant_match.group(1)
            if "smartStudentResumes" not in tenant_body:
                new_tenant_body = tenant_body.rstrip() + "\n  smartStudentResumes SmartStudentResume[]\n"
                schema = schema.replace(tenant_match.group(0), f"model Tenant {{{new_tenant_body}}}")

    with open(SCHEMA_PATH, "w") as f:
        f.write(schema)
    
    print("✨ Successfully updated schema with projects and atsScore!")
    return True

if __name__ == "__main__":
    if update_schema():
        print("🧹 Purging Next.js and Prisma client caches...")
        if os.path.exists(".next"):
            shutil.rmtree(".next")
        if os.path.exists("node_modules/.prisma"):
            shutil.rmtree("node_modules/.prisma")
        if os.path.exists("tsconfig.tsbuildinfo"):
            os.remove("tsconfig.tsbuildinfo")
        
        print(f"⚙️ Running npx prisma generate --schema={SCHEMA_PATH}...")
        subprocess.run(["npx", "prisma", "generate", f"--schema={SCHEMA_PATH}"], check=True)
        
        print("🚀 Running npm run build...")
        subprocess.run(["npm", "run", "build"], check=True)
        print("🎉 Build passed successfully!")
