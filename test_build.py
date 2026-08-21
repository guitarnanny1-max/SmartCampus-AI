import subprocess
import os

print("⚙️ Verifying environment and running build test...")

build_env = os.environ.copy()
build_env["DATABASE_URL"] = "postgresql://postgres:postgres@localhost:5432/smartcampus?schema=public"

try:
    print("1️⃣ Generating Prisma Client...")
    subprocess.run(["npx", "prisma", "generate"], check=True, env=build_env)
    
    print("2️⃣ Running Next.js Production Build...")
    subprocess.run(["npm", "run", "build"], check=True, env=build_env)
    
    print("\n🎉 SUCCESS! All routes, components, and pages compiled successfully with zero errors!")
except subprocess.CalledProcessError as e:
    print(f"\n❌ Build failed with exit code {e.returncode}")
    exit(1)
