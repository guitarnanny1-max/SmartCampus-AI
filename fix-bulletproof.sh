#!/bin/bash
set -e

echo "=================================================="
echo " 🛡️ Bulletproof Clean Install & Prisma Generation"
echo "=================================================="

echo "[1/6] Removing all caches, build artifacts, and node_modules..."
rm -rf .next node_modules package-lock.json

echo "[2/6] Reinstalling clean dependencies from package.json..."
npm install

echo "[3/6] Ensuring schema.prisma has standard generator block..."
python3 -c '
import re
path = "prisma/schema.prisma"
with open(path, "r") as f:
    content = f.read()

content = re.sub(r"generator\s+client\s*\{[^}]*\}", "", content)

standard_generator = """generator client {
  provider = "prisma-client-js"
}

"""
content = standard_generator + content
with open(path, "w") as f:
    f.write(content)
print("✨ Standard generator block applied!")
'

echo "[4/6] Generating Prisma Client..."
npx prisma generate

echo "[5/6] Syncing database schema..."
npx prisma db push --accept-data-loss

echo "[6/6] Starting Next.js development server..."
npm run dev
