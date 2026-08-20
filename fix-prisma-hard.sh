#!/bin/bash
set -e

echo "=================================================="
echo " 🚀 Hard Reset & Fix for .prisma/client/default"
echo "=================================================="

echo "[1/5] Cleaning corrupted caches and client links..."
rm -rf .next node_modules/.prisma node_modules/@prisma/client

echo "[2/5] Reinstalling fresh node packages..."
npm install

echo "[3/5] Verifying Prisma generator block..."
python3 -c '
path = "prisma/schema.prisma"
with open(path, "r") as f:
    content = f.read()

if "generator client {" not in content:
    block = "generator client {\n  provider = \"prisma-client-js\"\n}\n\n"
    content = block + content
    with open(path, "w") as f:
        f.write(content)
    print("✨ Added standard generator block.")
else:
    print("✨ Generator block verified.")
'

echo "[4/5] Generating fresh Prisma Client..."
npx prisma generate

echo "[5/5] Starting Next.js Development Server..."
npm run dev
