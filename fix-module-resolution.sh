#!/bin/bash
set -e

echo "=================================================="
echo " 🛠️ Fixing Prisma Module Resolution (.prisma/client/default)"
echo "=================================================="

echo "[1/5] Updating schema.prisma generator with explicit output path..."
python3 -c '
path = "prisma/schema.prisma"
with open(path, "r") as f:
    content = f.read()

# Remove existing generator block if any
import re
content = re.sub(r"generator\s+client\s*\{[^}]*\}", "", content)

# Add explicit generator block with output directed to node_modules/.prisma/client
new_generator = """generator client {
  provider = "prisma-client-js"
  output   = "../node_modules/.prisma/client"
}

"""

content = new_generator + content
with open(path, "w") as f:
    f.write(content)

print("✨ Explicit generator output configuration applied!")
'

echo "[2/5] Cleaning Next.js and Prisma caches..."
rm -rf .next node_modules/.prisma

echo "[3/5] Reinstalling clean Prisma dependencies..."
npm install @prisma/client prisma --save

echo "[4/5] Generating fresh Prisma Client binaries..."
npx prisma generate

echo "[5/5] Starting Next.js Development Server..."
npm run dev
