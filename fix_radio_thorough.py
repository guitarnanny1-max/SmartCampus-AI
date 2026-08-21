import subprocess
import os
import shutil
import re

SCHEMA_PATH = None
for root, dirs, files in os.walk("."):
    if "schema.prisma" in files:
        SCHEMA_PATH = os.path.join(root, "schema.prisma")
        break

if not SCHEMA_PATH:
    SCHEMA_PATH = "prisma/schema.prisma"

print(f"📁 Using schema path: {SCHEMA_PATH}")

def update_schema():
    if not os.path.exists(SCHEMA_PATH):
        print(f"❌ Error: {SCHEMA_PATH} not found.")
        return False

    with open(SCHEMA_PATH, "r") as f:
        schema = f.read()

    # Define SmartCampusRadioHub model with all fields referenced in the API route
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
    
    # Append the model definition
    schema += "\n\n" + model_def

    # Ensure relations exist on School
    school_match = re.search(r"model School\s*\{([^}]*)\}", schema)
    if school_match:
        school_body = school_match.group(1)
        rel = "  smartCampusRadioHubs SmartCampusRadioHub[]"
        if "smartCampusRadioHubs" not in school_body:
            school_body = school_body.rstrip() + "\n" + rel + "\n"
            schema = schema.replace(school_match.group(0), "model School {" + school_body + "}")

    # Ensure relations exist on Tenant
    tenant_match = re.search(r"model Tenant\s*\{([^}]*)\}", schema)
    if tenant_match:
        tenant_body = tenant_match.group(1)
        rel = "  smartCampusRadioHubs SmartCampusRadioHub[]"
        if "smartCampusRadioHubs" not in tenant_body:
            tenant_body = tenant_body.rstrip() + "\n" + rel + "\n"
            schema = schema.replace(tenant_match.group(0), "model Tenant {" + tenant_body + "}")

    with open(SCHEMA_PATH, "w") as f:
        f.write(schema)
    
    print("✨ Successfully updated schema file!")
    return True

if __name__ == "__main__":
    if update_schema():
        print("🧹 Purging all caches (.next, node_modules/.prisma, tsbuildinfo)...")
        if os.path.exists(".next"):
            shutil.rmtree(".next")
        if os.path.exists("node_modules/.prisma"):
            shutil.rmtree("node_modules/.prisma")
        if os.path.exists("tsconfig.tsbuildinfo"):
            os.remove("tsconfig.tsbuildinfo")
        
        print("⚙️ Running npx prisma generate...")
        subprocess.run(["npx", "prisma", "generate"], check=True)
        
        print("🚀 Running npm run build...")
        subprocess.run(["npm", "run", "build"], check=True)
        print("🎉 Build passed successfully!")
