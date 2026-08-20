#!/bin/bash
set -e

echo "=================================================="
echo " 🛠️ Fixing Prisma Client Path & Generation"
echo "=================================================="

echo "[1/4] Cleaning caches and missing directories..."
rm -rf .next src/generated/client
mkdir -p src/generated/client

echo "[2/4] Generating Prisma Client..."
npx prisma generate

echo "[3/4] Syncing database schema..."
npx prisma db push --accept-data-loss

echo "[4/4] Starting Next.js Development Server..."
npm run dev
