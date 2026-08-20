#!/bin/bash
set -e

echo "=================================================="
echo " 🚀 Upgrading Prisma Setup for Prisma 7 Compatibility"
echo "=================================================="

echo "[1/5] Installing @prisma/config package..."
npm install @prisma/config --save

echo "[2/5] Removing deprecated 'url' property from prisma/schema.prisma..."
python3 -c '
path = "prisma/schema.prisma"
with open(path, "r") as f:
    content = f.read()

import re
content = re.sub(r"url\s*=\s*[\"\\].*?[\"\\]", "", content)
content = re.sub(r"url\s*=\s*env\(.*?\)", "", content)

with open(path, "w") as f:
    f.write(content)

print("✨ Schema datasource url removed successfully!")
'

echo "[3/5] Creating prisma.config.ts in project root..."
cat << 'CONFIGEOF' > prisma.config.ts
import "dotenv/config";
import { defineConfig, env } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL") || "file:./dev.db",
  },
});
CONFIGEOF

echo "[4/5] Generating Prisma Client and syncing database..."
npx prisma generate
npx prisma db push --accept-data-loss

echo "[5/5] Starting Next.js Development Server..."
npm run dev
