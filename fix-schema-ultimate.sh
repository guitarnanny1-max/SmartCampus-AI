#!/bin/bash
set -e

echo "=================================================="
echo " 🧹 Sanitizing All Corrupted Prisma Defaults"
echo "=================================================="

python3 -c '
import re

path = "prisma/schema.prisma"
with open(path, "r") as f:
    content = f.read()

# Fix all variations of corrupted uuid defaults
content = re.sub(r"@default\s*\(\s*\"uuid\([^)]*\)\"\s*\)+", "@default(uuid())", content, flags=re.IGNORECASE)
content = re.sub(r"@default\s*\(\s*uuid\(\s*\)\s*\)+", "@default(uuid())", content, flags=re.IGNORECASE)
content = content.replace("@default(\"uuid(\")))", "@default(uuid())")
content = content.replace("@default(\"uuid(\"))", "@default(uuid())")
content = content.replace("@default(\"uuid()\"))", "@default(uuid())")

# Fix all variations of corrupted now defaults
content = re.sub(r"@default\s*\(\s*\"now\([^)]*\)\"\s*\)+", "@default(now())", content, flags=re.IGNORECASE)
content = re.sub(r"@default\s*\(\s*now\(\s*\)\s*\)+", "@default(now())", content, flags=re.IGNORECASE)

# Fix all variations of corrupted cuid defaults
content = re.sub(r"@default\s*\(\s*\"cuid\([^)]*\)\"\s*\)+", "@default(cuid())", content, flags=re.IGNORECASE)

with open(path, "w") as f:
    f.write(content)

print("✨ prisma/schema.prisma fully cleaned and normalized!")
'

echo "[1/3] Generating Prisma Client..."
npx prisma generate

echo "[2/3] Pushing database schema..."
npx prisma db push --accept-data-loss

echo "[3/3] Starting Next.js Development Server..."
npm run dev
