#!/bin/bash
set -e

echo "=================================================="
echo " 🚀 Forcing Prisma Client Generation & Booting Server"
echo "=================================================="

echo "[1/4] Cleaning previous Next.js cache and Prisma generated files..."
rm -rf .next node_modules/.prisma

echo "[2/4] Generating Prisma Client..."
npx prisma generate

echo "[3/4] Pushing database schema..."
npx prisma db push --accept-data-loss

echo "[4/4] Starting Next.js Development Server..."
npm run dev
