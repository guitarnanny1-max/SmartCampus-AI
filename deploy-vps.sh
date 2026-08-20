#!/usr/bin/env bash
set -e

echo "🚀 Starting SmartCampus AI VPS Deployment..."

echo "📥 Pulling latest updates from GitHub..."
git pull origin main

echo "📦 Installing production dependencies..."
npm ci --production=false

echo "⚙️ Generating Prisma Client & Pushing Database Schema..."
npx prisma generate
npx prisma db push

echo "🏗️ Building Next.js application..."
npm run build

echo "🔄 Restarting application cluster with PM2..."
pm2 reload ecosystem.config.js || pm2 start ecosystem.config.js

echo "🎉 Deployment completed successfully! SmartCampus AI is live."
