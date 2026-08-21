import subprocess
import os
import shutil

file_path = "src/app/api/water-hub/route.ts"
if os.path.exists(file_path):
    os.remove(file_path)
    print(f"🗑️ Removed {file_path}")

dir_path = "src/app/api/water-hub"
if os.path.exists(dir_path) and not os.listdir(dir_path):
    os.rmdir(dir_path)
    print(f"🗑️ Removed empty directory {dir_path}")

# Purge caches
for path in [".next", "node_modules/.prisma", "tsconfig.tsbuildinfo"]:
    if os.path.exists(path):
        if os.path.isdir(path):
            shutil.rmtree(path)
        else:
            os.remove(path)

print("⚙️ Running npx prisma generate...")
subprocess.run(["npx", "prisma", "generate"], check=True)

print("🚀 Running npm run build...")
subprocess.run(["npm", "run", "build"], check=True)
print("🎉 Build passed successfully!")
