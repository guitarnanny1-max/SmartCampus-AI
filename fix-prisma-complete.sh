#!/bin/bash
set -e

echo "=================================================="
echo " 🛠️ Comprehensive Prisma Repair & Generation"
echo "=================================================="

echo "[1/5] Fixing all unquoted string defaults in schema.prisma..."
python3 -c '
import re
path = "prisma/schema.prisma"
with open(path, "r") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if "String" in line and "@default(" in line:
        match = re.search(r"@default\(([^)]+)\)", line)
        if match:
            val = match.group(1).strip()
            if not (val.startswith("\"") or val.startswith("\x27")) and not val.endswith("()") and val.lower() not in ["true", "false"]:
                line = line.replace(f"@default({val})", f"@default(\"{val}\")")
        new_lines.append(line)

with open(path, "w") as f:
    f.writelines(new_lines)
print("✨ Schema string defaults successfully normalized.")
'

echo "[2/5] Cleaning build and cache directories..."
rm -rf .next node_modules/.prisma

echo "[3/5] Generating Prisma Client (Populating Types)..."
npx prisma generate

echo "[4/5] Pushing database schema..."
npx prisma db push --accept-data-loss

echo "[5/5] Starting Next.js Development Server..."
npm run dev
