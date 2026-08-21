import subprocess
import os
import shutil
import re

# Locate the correct schema.prisma file
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

    # Define SmartCampusRadioHub model with all fields referenced in route.ts
    model_def = """model SmartCampusRadioHub {
  id                    String   @id @default(uuid())
  tenantId              String?
  tenant                Tenant?  @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  schoolId              String?
  school                School?  @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  stationName           String?
  stationCode           String?
  frequency             String?  @default("101.5 FM")
  frequencyMhz          Float    @default(91.5)
  broadcastPowerKw      Float    @default(2.5)
  activeListenersCount  Int      @default(1250)
  aiBroadcastMode       String?  @default("AI_AUTONOMOUS_DYNAMIC_PLAYLIST")
  genre                 String?  @default("Campus News & Music")
  streamUrl             String?
  listenerCount         Int      @default(0)
  isLive                Boolean  @default(true)
  status                String   @default("ACTIVE")
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}"""

    # Remove old definition if it exists
    schema = re.sub(r'model SmartCampusRadioHub\s*\{[^}]*\}', '', schema)
    schema += "\n\n" + model_def

    # Ensure relations exist on School
    if "model School" in schema:
        school_match = re.search(r"model School\s*\{([^}]*)\}", schema)
        if school_match:
            school_body = school_match.group(1)
            if "smartCampusRadioHubs" not in school_body:
                new_school_body = school_body.rstrip() + "\n  smartCampusRadioHubs SmartCampusRadioHub[]\n"
                schema = schema.replace(school_match.group(0), f"model School {{{new_school_body}}}")

    # Ensure relations exist on Tenant
    if "model Tenant" in schema:
        tenant_match = re.search(r"model Tenant\s*\{([^}]*)\}", schema)
        if tenant_match:
            tenant_body = tenant_match.group(1)
            if "smartCampusRadioHubs" not in tenant_body:
                new_tenant_body = tenant_body.rstrip() + "\n  smartCampusRadioHubs SmartCampusRadioHub[]\n"
                schema = schema.replace(tenant_match.group(0), f"model Tenant {{{new_tenant_body}}}")

    with open(SCHEMA_PATH, "w") as f:
        f.write(schema)
    
    print("✨ Successfully updated schema file!")
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
