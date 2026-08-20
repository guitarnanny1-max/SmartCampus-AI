#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "=========================================="
echo " SmartCampus AI - Project Recovery Script"
echo "=========================================="

echo "[1/4] Generating Prisma Client..."
npx prisma generate

echo "[2/4] Pushing Database Schema..."
npx prisma db push

echo "[3/4] Seeding Initial Database Records..."
npx ts-node prisma/seed.ts || echo "⚠️ Seed script skipped or completed with warnings, continuing..."

echo "[4/4] Starting Next.js Development Server..."
npm run dev
