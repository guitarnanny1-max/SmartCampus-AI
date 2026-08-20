#!/bin/bash
set -e

echo "=================================================="
echo " 🚀 Bypassing Prisma Proxy Wrapper Permanently"
echo "=================================================="

echo "[1/5] Cleaning old build caches..."
rm -rf .next src/generated/client

echo "[2/5] Updating schema.prisma with custom output path..."
python3 -c '
import re

path = "prisma/schema.prisma"
with open(path, "r") as f:
    content = f.read()

# Remove existing generator and datasource blocks to prevent duplication/errors
content = re.sub(r"generator\s+client\s*\{[^}]*\}", "", content, flags=re.DOTALL)
content = re.sub(r"datasource\s+db\s*\{[^}]*\}", "", content, flags=re.DOTALL)

# Clean any escaped quotes or syntax artifacts
content = content.replace("\\\"", "\"")

# Prepend clean generator (with custom output) and datasource blocks
header = """generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/client"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

"""
content = header + content

with open(path, "w") as f:
    f.write(content)

print("✨ schema.prisma updated with custom client output path!")
'

echo "[3/5] Updating src/lib/prisma.ts to import from generated client..."
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

echo "[4/5] Generating Prisma Client and syncing database..."
npx prisma generate
npx prisma db push --accept-data-loss

echo "[5/5] Starting Next.js Development Server..."
npm run dev
