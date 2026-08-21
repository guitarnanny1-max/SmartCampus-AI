import os
import subprocess

print("⚙️ Synchronizing Prisma schema and rebuilding...")

# 1. Ensure schema.prisma has the correct Lead model definition
schema_path = "prisma/schema.prisma"
os.makedirs(os.path.dirname(schema_path), exist_ok=True)

schema_content = """datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Tenant {
  id        String   @id @default(cuid())
  name      String
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

print("✨ Updated prisma/schema.prisma with unified Lead model properties")

build_env = os.environ.copy()
build_env["DATABASE_URL"] = "postgresql://postgres:postgres@localhost:5432/smartcampus?schema=public"

try:
    print("2️⃣ Pushing Prisma schema and generating client...")
    subprocess.run(["npx", "prisma", "db", "push", "--skip-generate"], check=True, env=build_env)
    subprocess.run(["npx", "prisma", "generate"], check=True, env=build_env)
    
    print("3️⃣ Running Next.js Production Build...")
    subprocess.run(["npm", "run", "build"], check=True, env=build_env)
    
    print("\n🎉 SUCCESS! Build passed with zero errors!")
except subprocess.CalledProcessError as e:
    print(f"\n❌ Build failed with exit code {e.returncode}")
    exit(1)
