#!/bin/bash
set -e

echo "=================================================="
echo " 🚀 Forcing Prisma Client Generation & Clean Boot"
echo "=================================================="

echo "[1/4] Clearing Next.js and Prisma client caches..."
rm -rf .next node_modules/.prisma

echo "[2/4] Generating Prisma Client..."
npx prisma generate

echo "[3/4] Pushing Database Schema..."
npx prisma db push --accept-data-loss

echo "[4/4] Starting Next.js Development Server..."
npm run dev
