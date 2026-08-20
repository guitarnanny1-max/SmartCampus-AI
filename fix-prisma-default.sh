#!/bin/bash
set -e

echo "=================================================="
echo " 🛠️ Ultimate Fix for .prisma/client/default Error"
echo "=================================================="

echo "[1/5] Cleaning up caches (.next & node_modules/.prisma)..."
rm -rf .next node_modules/.prisma

echo "[2/5] Verifying generator block in schema.prisma..."
python3 -c '
path = "prisma/schema.prisma"
with open(path, "r") as f:
    content = f.read()

if "generator client {" not in content:
    generator_block = "generator client {\n  provider = \"prisma-client-js\"\n}\n\n"
    content = generator_block + content
    with open(path, "w") as f:
        f.write(content)
    print("✨ Added missing generator block!")
else:
    print("✨ Generator block verified!")
'

echo "[3/5] Syncing Prisma package versions..."
npm install prisma @prisma/client --save

echo "[4/5] Generating fresh Prisma Client..."
npx prisma generate

echo "[5/5] Starting Next.js Development Server..."
npm run dev
