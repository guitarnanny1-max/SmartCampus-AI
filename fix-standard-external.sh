#!/bin/bash
set -e

echo "=================================================="
echo " 🔧 Restoring Standard Prisma Client & External Config"
echo "=================================================="

echo "[1/5] Restoring standard generator in schema.prisma..."
python3 -c '
import re
path = "prisma/schema.prisma"
with open(path, "r") as f:
    content = f.read()

content = re.sub(r"generator\s+client\s*\{[^}]*\}", "", content, flags=re.DOTALL)
content = re.sub(r"datasource\s+db\s*\{[^}]*\}", "", content, flags=re.DOTALL)
content = content.replace("\\\"", "\"")

header = "generator client {\n  provider = \"prisma-client-js\"\n}\n\ndatasource db {\n  provider = \"sqlite\"\n  url      = \"file:./dev.db\"\n}\n\n"
content = header + content

with open(path, "w") as f:
    f.write(content)
print("✨ schema.prisma restored to standard output!")
'

echo "[2/5] Restoring standard import in src/lib/prisma.ts..."
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

echo "[3/5] Configuring serverComponentsExternalPackages in next.config.js..."
cat << 'CONFIGEOF' > next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  serverComponentsExternalPackages: ['@prisma/client'],
};

module.exports = nextConfig;
CONFIGEOF

echo "[4/5] Cleaning caches and generating Prisma client..."
rm -rf .next src/generated/client
npx prisma generate
npx prisma db push --accept-data-loss

echo "[5/5] Starting Next.js Development Server..."
npm run dev
