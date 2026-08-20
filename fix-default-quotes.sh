#!/bin/bash
set -e

echo "=================================================="
echo " 🛠️ Fixing Unquoted String Defaults in Prisma Schema"
echo "=================================================="

python3 -c '
import re
path = "prisma/schema.prisma"
with open(path, "r") as f:
    content = f.read()

# Convert unquoted uppercase defaults like @default(TENANT_ADMIN) to @default("TENANT_ADMIN")
content = re.sub(r"@default\s*\(\s*([A-Z][A-Z_]*)\s*\)", r"@default(\"\1\")", content)

with open(path, "w") as f:
    f.write(content)

print("✨ Unquoted defaults successfully wrapped in quotes!")
'

echo "[1/3] Generating Prisma Client..."
npx prisma generate

echo "[2/3] Pushing Database Schema..."
npx prisma db push --accept-data-loss

echo "[3/3] Starting Next.js Development Server..."
npm run dev
