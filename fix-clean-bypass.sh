#!/bin/bash
set -e

echo "=================================================="
echo " 🚀 Bypassing Prisma Proxy Wrapper (Clean ASCII)"
echo "=================================================="

echo "[1/5] Cleaning old build caches..."
rm -rf .next src/generated/client

echo "[2/5] Updating schema.prisma with custom output path..."
python3 -c '
import re

path = "prisma/schema.prisma"
with open(path, "r") as f:
    content = f.read()

content = re.sub(r"generator\s+client\s*\{[^}]*\}", "", content, flags=re.DOTALL)
content = re.sub(r"datasource\s+db\s*\{[^}]*\}", "", content, flags=re.DOTALL)
content = content.replace("\\\"", "\"")

header = "generator client {\n  provider = \"prisma-client-js\"\n  output   = \"../src/generated/client\"\n}\n\ndatasource db {\n  provider = \"sqlite\"\n  url      = \"file:./dev.db\"\n}\n\n"
content = header + content

with open(path, "w") as f:
    f.write(content)

print("✨ schema.prisma updated successfully!")
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
