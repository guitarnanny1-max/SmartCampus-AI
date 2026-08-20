#!/bin/bash
set -e

echo "=================================================="
echo " 🔧 Fixing Next.js & Prisma Module Resolution"
echo "=================================================="

echo "[1/4] Configuring serverComponentsExternalPackages in next.config.js..."
cat << 'CONFIGEOF' > next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  serverComponentsExternalPackages: ['@prisma/client'],
};

module.exports = nextConfig;
CONFIGEOF

echo "[2/4] Clearing Next.js and Prisma caches..."
rm -rf .next node_modules/.prisma

echo "[3/4] Generating fresh Prisma Client binaries & syncing database..."
npx prisma generate
npx prisma db push --accept-data-loss

echo "[4/4] Starting Next.js Development Server..."
npm run dev
