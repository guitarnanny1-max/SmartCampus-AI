#!/bin/bash
set -e

echo "=================================================="
echo " 🛠️ Fixing HostelRoom Prisma Client & Rebuilding"
echo "=================================================="

# Ensure proper Prisma client singleton helper exists
mkdir -p src/lib
cat << 'LIB' > src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
LIB

# Clear all build and client caches
rm -rf .next
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma/client

echo "[1/3] Generating Prisma Client..."
npx prisma generate

echo "[2/3] Pushing database schema..."
npx prisma db push --accept-data-loss

echo "[3/3] Running Next.js Production Build..."
npm run build

echo "✨ Build completed successfully!"
