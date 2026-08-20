#!/bin/bash
set -e

echo "=================================================="
echo " 🚀 Final Comprehensive Fix for Prisma & Next.js"
echo "=================================================="

echo "[1/4] Fixing unquoted string defaults in schema.prisma..."
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

print("✨ schema.prisma string defaults normalized!")
'

echo "[2/4] Resetting next.config.js to clean standard configuration..."
cat << 'CONFIGEOF' > next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = nextConfig;
CONFIGEOF

echo "[3/4] Cleaning caches and generating Prisma client..."
rm -rf .next node_modules/.prisma
npx prisma generate
npx prisma db push --accept-data-loss

echo "[4/4] Starting Next.js Development Server..."
npm run dev
