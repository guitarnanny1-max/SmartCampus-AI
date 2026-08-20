#!/bin/bash
set -e

echo "=================================================="
echo " 🔧 Fixing Prisma Client Missing Module Error..."
echo "=================================================="

echo "[1/4] Clearing Next.js cache (.next)..."
rm -rf .next

echo "[2/4] Generating fresh Prisma Client..."
npx prisma generate

echo "[3/4] Pushing Database Schema..."
npx prisma db push --accept-data-loss

echo "[4/4] Starting Next.js Development Server..."
npm run dev
