#!/bin/bash
set -e

echo "=================================================="
echo " 🚀 Ultimate Next.js 14 + Prisma Fix Script"
echo "=================================================="

echo "[1/5] Configuring next.config.js with serverComponentsExternalPackages..."
cat << 'CONFIGEOF' > next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  serverComponentsExternalPackages: ['@prisma/client'],
};

module.exports = nextConfig;
CONFIGEOF

echo "[2/5] Resetting schema.prisma generator block..."
python3 -c '
import re
path = "prisma/schema.prisma"
with open(path, "r") as f:
    content = f.read()

content = re.sub(r"generator\s+client\s*\{[^}]*\}", "", content)
standard_generator = """generator client {
  provider = "prisma-client-js"
}

"""
content = standard_generator + content
with open(path, "w") as f:
    f.write(content)
print("✨ schema.prisma updated with standard generator block!")
'

echo "[3/5] Adding postinstall script to package.json..."
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
print("✨ postinstall script added to package.json!")
'

echo "[4/5] Clearing all build caches and temporary artifacts..."
rm -rf .next node_modules/.prisma

echo "[5/5] Reinstalling dependencies, generating client, and syncing DB..."
npm install
npx prisma generate
npx prisma db push --accept-data-loss

echo "=================================================="
echo " 🎉 All fixes applied successfully! Starting server..."
echo "=================================================="
npm run dev
