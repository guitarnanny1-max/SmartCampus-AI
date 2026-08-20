#!/bin/bash
set -e

echo "=================================================="
echo " 🎯 Applying Direct Node Module Prisma Client Fix"
echo "=================================================="

echo "[1/4] Updating schema.prisma to output directly to node_modules/@prisma/client..."
python3 -c '
import re
path = "prisma/schema.prisma"
with open(path, "r") as f:
    content = f.read()

# Remove any existing generator client block
content = re.sub(r"generator\s+client\s*\{[^}]*\}", "", content)

# Add generator with direct output to node_modules/@prisma/client
direct_generator = """generator client {
  provider = "prisma-client-js"
  output   = "../node_modules/@prisma/client"
}

"""
content = direct_generator + content

with open(path, "w") as f:
    f.write(content)
print("✨ Direct output generator configured!")
'

echo "[2/4] Clearing Next.js cache..."
rm -rf .next

echo "[3/4] Generating Prisma Client directly into node_modules/@prisma/client..."
npx prisma generate
npx prisma db push --accept-data-loss

echo "[4/4] Starting Next.js Development Server..."
npm run dev
