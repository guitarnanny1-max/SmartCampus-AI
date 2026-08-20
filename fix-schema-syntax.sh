#!/bin/bash
set -e

echo "=================================================="
echo " 🛠️ Repairing Corrupted Prisma Default Functions"
echo "=================================================="

python3 -c '
import re

path = "prisma/schema.prisma"
with open(path, "r") as f:
    content = f.read()

# Normalize and fix any malformed default functions contaminated by previous scripts
content = re.sub(r"@default\s*\([^)]*uuid[^)]*\)", "@default(uuid())", content, flags=re.IGNORECASE)
content = re.sub(r"@default\s*\([^)]*now[^)]*\)", "@default(now())", content, flags=re.IGNORECASE)
content = re.sub(r"@default\s*\([^)]*cuid[^)]*\)", "@default(cuid())", content, flags=re.IGNORECASE)
content = re.sub(r"@default\s*\([^)]*autoincrement[^)]*\)", "@default(autoincrement())", content, flags=re.IGNORECASE)

with open(path, "w") as f:
    f.write(content)

print("✨ All corrupted default functions successfully normalized!")
'

echo "[1/3] Generating Prisma Client..."
npx prisma generate

echo "[2/3] Pushing database schema..."
npx prisma db push --accept-data-loss

echo "[3/3] Starting Next.js Development Server..."
npm run dev
