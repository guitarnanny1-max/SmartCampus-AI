#!/bin/bash
set -e

echo "=================================================="
echo " 🧹 Deep Cleaning Malformed Prisma Defaults"
echo "=================================================="

python3 -c '
import re

path = "prisma/schema.prisma"
with open(path, "r") as f:
    content = f.read()

# Fix exact error patterns: @default("uuid(")) and @default("now("))
content = re.sub(r"@default\s*\(\s*\"uuid\([^)]*\)\"\s*\)", "@default(uuid())", content, flags=re.IGNORECASE)
content = re.sub(r"@default\s*\(\s*\"now\([^)]*\)\"\s*\)", "@default(now())", content, flags=re.IGNORECASE)
content = re.sub(r"@default\s*\(\s*\"cuid\([^)]*\)\"\s*\)", "@default(cuid())", content, flags=re.IGNORECASE)
content = re.sub(r"@default\s*\(\s*\"autoincrement\([^)]*\)\"\s*\)", "@default(autoincrement())", content, flags=re.IGNORECASE)

# Catch residual malformed variations with extra closing parens
content = content.replace("@default(\"uuid(\"))", "@default(uuid())")
content = content.replace("@default(\"now(\"))", "@default(now())")
content = content.replace("@default(\"cuid(\"))", "@default(cuid())")
content = content.replace("@default(\"uuid(\")", "@default(uuid())")
content = content.replace("@default(\"now(\")", "@default(now())")

# Clean any leftover trailing double parentheses in default blocks
content = re.sub(r"@default\(([^)]+)\)\s*\)", r"@default(\1)", content)

with open(path, "w") as f:
    f.write(content)

print("✨ Schema default functions thoroughly cleaned and repaired!")
'

echo "[1/3] Generating Prisma Client..."
npx prisma generate

echo "[2/3] Pushing database schema..."
npx prisma db push --accept-data-loss

echo "[3/3] Starting Next.js Development Server..."
npm run dev
