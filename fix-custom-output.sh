#!/bin/bash
set -e

echo "=================================================="
echo " 🚀 Configuring Direct Custom Prisma Output"
echo "=================================================="

echo "[1/5] Updating schema.prisma with explicit custom output path..."
python3 -c '
import re
path = "prisma/schema.prisma"
with open(path, "r") as f:
    content = f.read()

content = re.sub(r"generator\s+client\s*\{[^}]*\}", "", content, flags=re.DOTALL)
content = re.sub(r"datasource\s+db\s*\{[^}]*\}", "", content, flags=re.DOTALL)
content = content.replace("\\\"", "\"")

header = """generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/client"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

"""
content = header + content
with open(path, "w") as f:
    f.write(content)
print("✨ schema.prisma configured with custom output!")
'

echo "[2/5] Updating src/lib/prisma.ts to import from generated path..."
mkdir -p src/lib
cat << 'PRISMAEOF' > src/lib/prisma.ts
import { PrismaClient } from '../generated/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
PRISMAEOF

echo "[3/5] Updating package.json scripts to auto-generate client on boot..."
node -e '
const fs = require("fs");
const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
pkg.scripts = pkg.scripts || {};
pkg.scripts.dev = "prisma generate && next dev";
pkg.scripts.postinstall = "prisma generate";
fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));
console.log("✨ package.json scripts updated successfully!");
'

echo "[4/5] Cleaning caches and generating client..."
rm -rf .next src/generated/client
npx prisma generate
npx prisma db push --accept-data-loss

echo "[5/5] Starting Next.js Development Server..."
npm run dev
