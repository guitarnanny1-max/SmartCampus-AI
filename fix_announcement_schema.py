import os
import subprocess

print("⚙️ Adding Announcement model to Prisma schema...")

schema_path = "prisma/schema.prisma"
os.makedirs(os.path.dirname(schema_path), exist_ok=True)

schema_content = """datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

model Tenant {
  id            String         @id @default(cuid())
  name          String
  subdomain     String         @unique
  plan          String         @default("Enterprise ERP Suite")
  status        String         @default("ACTIVE")
  contactEmail  String         @default("admin@example.com")
  mrr           Float          @default(0.0)
  setupFeePaid  Boolean        @default(false)
  createdAt     DateTime       @default(now())
  students      Student[]
  invoices      Invoice[]
  announcements Announcement[]
}

model Student {
  id              String   @id @default(cuid())
  admissionNumber String   @default("ADM-2026-0001")
  name            String
  grade           String   @default("Grade 10")
  guardianName    String   @default("Guardian")
  phone           String?
  email           String?
  status          String   @default("Active")
  feeStatus       String   @default("PENDING")
  tenantId        String
  tenant          Tenant   @relation(fields: [tenantId], references: [id])
  createdAt       DateTime @default(now())
}

model Invoice {
  id          String   @id @default(cuid())
  title       String   @default("Tuition Fee")
  amount      Float    @default(0.0)
  status      String   @default("Pending")
  dueDate     String   @default("2026-12-31")
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  createdAt   DateTime @default(now())
}

model Announcement {
  id        String   @id @default(cuid())
  title     String
  content   String
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  createdAt DateTime @default(now())
}

model Lead {
  id              String   @id @default(cuid())
  name            String
  school          String
  phone           String
  email           String
  studentStrength Int?
  location        String?
  interest        String?
  score           Int      @default(0)
  temperature     String   @default("🔵 Cold")
  status          String   @default("NEW")
  createdAt       DateTime @default(now())
}
"""

with open(schema_path, "w", encoding="utf-8") as f:
    f.write(schema_content)

print("✨ Updated prisma/schema.prisma with Announcement model!")

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
