import subprocess
import os
import shutil

print("🧹 Cleaning Next.js build cache (.next)...")
if os.path.exists(".next"):
    shutil.rmtree(".next")

print("⚙️ Regenerating Prisma Client...")
subprocess.run(["npx", "prisma", "generate"], check=True)

print("🚀 Running fresh npm run build...")
subprocess.run(["npm", "run", "build"], check=True)

print("🎉 Build completed successfully!")
