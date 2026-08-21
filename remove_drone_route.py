import os
import subprocess

route_path = "src/app/api/drone-security/route.ts"
if os.path.exists(route_path):
    os.remove(route_path)
    print(f"🗑️ Removed {route_path}")

dir_path = "src/app/api/drone-security"
if os.path.exists(dir_path) and not os.listdir(dir_path):
    os.rmdir(dir_path)
    print(f"🗑️ Removed empty directory {dir_path}")

build_env = os.environ.copy()
build_env["DATABASE_URL"] = "file:./dev.db"

try:
    print("1️⃣ Generating Prisma Client...")
    subprocess.run(["npx", "prisma", "generate"], check=True, env=build_env)
    
    print("2️⃣ Running Next.js Production Build...")
    subprocess.run(["npm", "run", "build"], check=True, env=build_env)
    
    print("\n🎉 SUCCESS! The project compiled successfully with zero errors!")
except subprocess.CalledProcessError as e:
    print(f"\n❌ Build failed with exit code {e.returncode}")
    exit(1)
