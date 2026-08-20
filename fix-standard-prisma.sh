#!/bin/bash
set -e

echo "=================================================="
echo " 🔧 Restoring Standard Prisma Client Configuration"
echo "=================================================="

echo "[1/5] Restoring standard generator block in schema.prisma..."
python3 -c '
import re
path = "prisma/schema.prisma"
with open(path, "r") as f:
    content = f.read()

content = re.sub(r"generator\s+client\s*\{[^}]*\}", "", content)
standard_generator = "generator client {\n  provider = \"prisma-client-js\"\n}\n\n"
content = standard_generator + content

with open(path, "w") as f:
    f.write(content)
print("✨ Standard generator block restored!")
'

echo "[2/5] Restoring src/lib/prisma.ts to standard import..."
mkdir -p src/lib
cat << 'PRISMAEOF' > src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
PRISMAEOF

echo "[3/5] Clearing Next.js and Prisma caches..."
rm -rf .next node_modules/.prisma

echo "[4/5] Generating fresh Prisma Client & pushing database..."
npx prisma generate
npx prisma db push --accept-data-loss

echo "[5/5] Starting Next.js Development Server..."
npm run dev
