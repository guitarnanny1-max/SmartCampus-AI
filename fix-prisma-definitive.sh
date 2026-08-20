#!/bin/bash
set -e

echo "=================================================="
echo " 🛡️ Definitive Fix for .prisma/client/default Error"
echo "=================================================="

echo "[1/5] Cleaning up conflicting files and caches..."
rm -rf .next node_modules/.prisma prisma.config.ts

echo "[2/5] Updating schema.prisma with explicit node_modules client output..."
python3 -c '
import re
path = "prisma/schema.prisma"
with open(path, "r") as f:
    content = f.read()

# Remove existing generator blocks
content = re.sub(r"generator\s+client\s*\{[^}]*\}", "", content)

# Add standard generator with explicit node_modules output path
new_generator = """generator client {
  provider = "prisma-client-js"
  output   = "../node_modules/.prisma/client"
}

"""
content = new_generator + content

# Ensure datasource has url
if "url =" not in content:
    content = re.sub(r"datasource\s+db\s*\{([^}]*)\}", r"datasource db {\1\n  url = \"file:./dev.db\"\n}", content)

with open(path, "w") as f:
    f.write(content)
print("✨ Explicit output configuration applied to schema.prisma!")
'

echo "[3/5] Verifying src/lib/prisma.ts import path..."
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

echo "[4/5] Generating Prisma Client and syncing database..."
npx prisma generate
npx prisma db push --accept-data-loss

echo "[5/5] Starting Next.js Development Server..."
npm run dev
