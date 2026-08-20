#!/usr/bin/env bash
set -e

echo "🚀 Initializing SmartCampus AI Full Build & Verification Script..."

echo "📦 Step 1: Installing dependencies..."
npm install

echo "⚙️ Step 2: Generating Prisma Client..."
npx prisma generate

echo "🗄️ Step 3: Resetting and pushing database schema..."
npx prisma db push --force-reset

echo "🌱 Step 4: Seeding enterprise multi-tenant data..."
npx ts-node prisma/seed.ts

echo "🔍 Step 5: Running platform verification suite..."
npm run verify

echo "🏗️ Step 6: Building Next.js application for production..."
npm run build

echo "🎉 SmartCampus AI successfully initialized, verified, and built!"
