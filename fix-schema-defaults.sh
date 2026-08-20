#!/bin/bash
set -e

echo "=================================================="
echo " 🛠️ Fixing Corrupted Prisma Default Functions"
echo "=================================================="

echo "[1/4] Repairing malformed function defaults in schema.prisma..."
python3 -c '
import re

path = "prisma/schema.prisma"
with open(path, "r") as f:
    content = f.read()

# Fix corrupted function defaults like @default("uuid(")) or @default("now("))
content = re.sub(r"@default\s*\(\s*\"uuid\([^)]*\)\"\s*\)", "@default(uuid())", content, flags=re.IGNORECASE)
content = re.sub(r"@default\s*\(\s*\"now\([^)]*\)\"\s*\)", "@default(now())", content, flags=re.IGNORECASE)
content = re.sub(r"@default\s*\(\s*\"cuid\([^)]*\)\"\s*\)", "@default(cuid())", content, flags=re.IGNORECASE)
content = re.sub(r"@default\s*\(\s*\"autoincrement\([^)]*\)\"\s*\)", "@default(autoincrement())", content, flags=re.IGNORECASE)

# Catch any remaining malformed function strings inside default
content = re.sub(r"@default\s*\(\s*\"([a-zA-Z]+)\(\s*\)\"\s*\)", r"@default(\1())", content)

with open(path, "w") as f:
    f.write(content)

print("✨ Schema default functions successfully repaired!")
'

echo "[2/4] Cleaning old build caches and generated client..."
rm -rf .next src/generated/client

echo "[3/4] Generating Prisma Client and pushing database..."
npx prisma generate
npx prisma db push --accept-data-loss

echo "[4/4] Starting Next.js Development Server..."
npm run dev
