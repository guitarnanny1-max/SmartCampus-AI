import os
import shutil
import subprocess

print("🧹 Cleaning Next.js build cache...")
if os.path.exists(".next"):
    shutil.rmtree(".next")
    print("Removed .next directory.")

print("⚙️ Ensuring src/lib/db.ts exports 'db'...")

os.makedirs("src/lib", exist_ok=True)
db_path = "src/lib/db.ts"

db_content = """import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db = globalForPrisma.prisma || new PrismaClient();
export const prisma = db;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
"""

with open(db_path, "w", encoding="utf-8") as f:
    f.write(db_content)

print("✨ Created/Updated src/lib/db.ts successfully!")

build_env = os.environ.copy()
build_env["DATABASE_URL"] = "file:./dev.db"

try:
    print("1️⃣ Generating Prisma Client...")
    subprocess.run(["npx", "prisma", "generate"], check=True, env=build_env)
    
    print("2️⃣ Running Next.js Production Build...")
    subprocess.run(["npm", "run", "build"], check=True, env=build_env)
    
    print("\n🎉 SUCCESS! The entire project compiled successfully with zero errors!")
except subprocess.CalledProcessError as e:
    print(f"\n❌ Build failed with exit code {e.returncode}")
    exit(1)
