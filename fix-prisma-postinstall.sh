#!/bin/bash
set -e

echo "=================================================="
echo " 🛡️ Permanent Fix: Adding Postinstall Hook & Rebuilding"
echo "=================================================="

echo "[1/5] Injecting 'postinstall' script into package.json..."
python3 -c '
import json
path = "package.json"
with open(path, "r") as f:
    data = json.load(f)

if "scripts" not in data:
    data["scripts"] = {}

data["scripts"]["postinstall"] = "prisma generate"

with open(path, "w") as f:
    json.dump(data, f, indent=2)
print("✨ Postinstall hook added to package.json!")
'

echo "[2/5] Cleaning caches..."
rm -rf .next node_modules/.prisma

echo "[3/5] Reinstalling dependencies (triggers automatic prisma generate)..."
npm install

echo "[4/5] Pushing database schema..."
npx prisma db push --accept-data-loss

echo "[5/5] Starting Next.js Development Server..."
npm run dev
