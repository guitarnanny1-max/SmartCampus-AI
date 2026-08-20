#!/bin/bash
set -e

echo "=================================================="
echo " 🚀 Bypassing Prisma Proxy Wrapper for Next.js"
echo "=================================================="

echo "[1/5] Updating schema.prisma with explicit custom output path..."
python3 -c '
import re
path = "prisma/schema.prisma"
with open(path, "r") as f:
    content = f.read()

content = re.sub(r"generator\s+client\s*\{[^}]*\}", "", content)
custom_generator = """generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/client"
}

"""
content = custom_generator + content
with open(path, "w") as f:
    f.write(content)
print("✨ Custom output path configured in schema.prisma!")
'

echo "[2/5] Updating src/lib/prisma.ts to use direct import..."
mkdir -p src/lib
cat << 'PRISMAEOF' > src/lib/prisma.ts
import { PrismaClient } from '../generated/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
PRISMAEOF

echo "[3/5] Cleaning Next.js cache..."
rm -rf .next

echo "[4/5] Generating Prisma Client and syncing database..."
npx prisma generate
npx prisma db push --accept-data-loss

echo "[5/5] Starting Next.js Development Server..."
npm run dev
