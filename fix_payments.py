import subprocess
import os
import re

SCHEMA_PATH = "prisma/schema.prisma"

def update_schema():
    if not os.path.exists(SCHEMA_PATH):
        print(f"❌ Error: {SCHEMA_PATH} not found.")
        return False

    with open(SCHEMA_PATH, "r") as f:
        schema = f.read()

    # Define SmartPaymentExtensionHub model with newRenewalDate included
    model_def = """model SmartPaymentExtensionHub {
  id                 String   @id @default(uuid())
  tenantId           String?
  tenant             Tenant?  @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  schoolId           String?
  school             School?  @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  extensionName      String?
  extensionCode      String?
  paymentGateway     String?
  invoiceId          String?
  amountPaid         String?
  extensionPeriod    String?
  previousRenewal    String?
  newRenewalDate     String?
  transactionFeePct  Float    @default(1.5)
  aiFraudDetection   Boolean  @default(true)
  status             String   @default("ACTIVE")
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}"""

    # Remove old definition if exists
    schema = re.sub(r'model SmartPaymentExtensionHub\s*\{[^}]*\}', '', schema)
    
    # Append new model definition
    schema += "\n\n" + model_def

    # Ensure relations exist on School
    school_match = re.search(r"model School\s*\{([^}]*)\}", schema)
    if school_match:
        school_body = school_match.group(1)
        rel = "  smartPaymentExtensionHubs SmartPaymentExtensionHub[]"
        if "smartPaymentExtensionHubs" not in school_body:
            school_body = school_body.rstrip() + "\n" + rel + "\n"
            schema = schema.replace(school_match.group(0), "model School {" + school_body + "}")

    # Ensure relations exist on Tenant
    tenant_match = re.search(r"model Tenant\s*\{([^}]*)\}", schema)
    if tenant_match:
        tenant_body = tenant_match.group(1)
        rel = "  smartPaymentExtensionHubs SmartPaymentExtensionHub[]"
        if "smartPaymentExtensionHubs" not in tenant_body:
            tenant_body = tenant_body.rstrip() + "\n" + rel + "\n"
            schema = schema.replace(tenant_match.group(0), "model Tenant {" + tenant_body + "}")

    with open(SCHEMA_PATH, "w") as f:
        f.write(schema)
    
    print("✨ Successfully added newRenewalDate to SmartPaymentExtensionHub!")
    return True

if __name__ == "__main__":
    if update_schema():
        print("🧹 Clearing Next.js cache...")
        if os.path.exists(".next"):
            import shutil
            shutil.rmtree(".next")
        
        print("⚙️ Running npx prisma generate...")
        subprocess.run(["npx", "prisma", "generate"], check=True)
        
        print("🚀 Running npm run build...")
        subprocess.run(["npm", "run", "build"], check=True)
        print("🎉 Build passed successfully!")
