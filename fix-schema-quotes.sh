#!/bin/bash
set -e

echo "=================================================="
echo " 🛠️ Fixing Unquoted Integer Defaults in Schema"
echo "=================================================="

python3 -c '
import re

path = "prisma/schema.prisma"
with open(path, "r") as f:
    content = f.read()

# Fix pattern: @default(1234) -> @default("1234")
# This targets cases where a digit is provided as a default for what is likely a String field
content = re.sub(r"@default\((\d+)\)", r'@default("\1")', content)

with open(path, "w") as f:
    f.write(content)

print("✨ Schema default quotes repaired successfully!")
'

echo "[1/3] Generating Prisma Client..."
npx prisma generate

echo "[2/3] Pushing database schema..."
npx prisma db push --accept-data-loss

echo "[3/3] Starting Next.js Development Server..."
npm run dev
