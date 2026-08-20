#!/bin/bash
set -e

echo "=================================================="
echo " 🔧 Resetting Prisma Generator to Default Output"
echo "=================================================="

echo "[1/5] Restoring standard generator block in schema.prisma..."
python3 -c '
import re
path = "prisma/schema.prisma"
with open(path, "r") as f:
    content = f.read()

# Remove any custom generator blocks
content = re.sub(r"generator\s+client\s*\{[^}]*\}", "", content)

# Insert standard default generator block
standard_generator = """generator client {
  provider = "prisma-client-js"
}

"""
content = standard_generator + content

with open(path, "w") as f:
    f.write(content)

print("✨ Standard generator configuration applied!")
'

echo "[2/5] Purging all build caches and client directories..."
rm -rf .next node_modules/.prisma node_modules/@prisma/client

echo "[3/5] Reinstalling exact matching Prisma packages..."
npm install prisma@latest @prisma/client@latest --save

echo "[4/5] Generating fresh Prisma Client..."
npx prisma generate

echo "[5/5] Starting Next.js Development Server..."
npm run dev
