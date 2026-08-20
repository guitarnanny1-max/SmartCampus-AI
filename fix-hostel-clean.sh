#!/bin/bash
set -e

echo "=================================================="
echo " 🛠️ Cleaning Cache & Regenerating Prisma Client"
echo "=================================================="

# Clear Next.js and Prisma client caches
rm -rf .next
rm -rf node_modules/.prisma

echo "[1/3] Generating Prisma Client..."
npx prisma generate

echo "[2/3] Pushing database schema..."
npx prisma db push --accept-data-loss

echo "[3/3] Running Next.js Production Build..."
npm run build

echo "✨ Build completed successfully!"
