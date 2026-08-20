#!/bin/bash
set -e

echo "=================================================="
echo " 🛠️ Absolute Fix for .prisma/client/default"
echo "=================================================="

echo "[1/4] Cleaning Next.js and Prisma build artifacts..."
rm -rf .next node_modules/.prisma

echo "[2/4] Ensuring postinstall hook is configured in package.json..."
node -e '
const fs = require("fs");
const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
pkg.scripts = pkg.scripts || {};
pkg.scripts.postinstall = "prisma generate";
fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));
console.log("✨ postinstall script verified in package.json");
'

echo "[3/4] Generating fresh Prisma Client & syncing database..."
npx prisma generate
npx prisma db push --accept-data-loss

echo "=================================================="
echo " ✅ Setup Complete! Starting Next.js Server..."
echo "=================================================="
npm run dev
