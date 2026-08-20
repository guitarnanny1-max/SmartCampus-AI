#!/bin/bash
set -e

echo "=================================================="
echo " 🔧 Fixing Prisma Version Mismatch & Client Path"
echo "=================================================="

echo "[1/6] Restoring standard datasource url & generator in schema.prisma..."
python3 -c '
import re
path = "prisma/schema.prisma"
with open(path, "r") as f:
    content = f.read()

# Normalize generator to standard prisma-client-js
content = re.sub(r"generator\s+client\s*\{[^}]*\}", "generator client {\n  provider = \"prisma-client-js\"\n}", content)

# Ensure datasource has url property
if "url =" not in content:
    content = re.sub(r"datasource\s+db\s*\{([^}]*)\}", r"datasource db {\1\n  url = \"file:./dev.db\"\n}", content)

with open(path, "w") as f:
    f.write(content)
print("✨ Schema datasource and generator normalized!")
'

echo "[2/6] Removing experimental prisma.config.ts..."
rm -f prisma.config.ts

echo "[3/6] Purging old caches and client directories..."
rm -rf .next node_modules/.prisma node_modules/@prisma/client

echo "[4/6] Installing matching Prisma CLI and Client packages (v5.22.0)..."
npm install prisma@5.22.0 @prisma/client@5.22.0 --save

echo "[5/6] Generating fresh Prisma Client and syncing database..."
npx prisma generate
npx prisma db push --accept-data-loss

echo "[6/6] Starting Next.js Development Server..."
npm run dev
