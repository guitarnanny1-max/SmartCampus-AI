#!/bin/bash
set -e

echo "=================================================="
echo " 🛠️ Fixing API Route Syntax & Prisma Configuration"
echo "=================================================="

echo "[1/5] Fixing syntax error in src/app/api/smart-helpdesk/route.ts..."
python3 -c '
path = "src/app/api/smart-helpdesk/route.ts"
try:
    with open(path, "r") as f:
        content = f.read()
    content = content.replace("} else.lowerQ = lowerQ;", "} else {")
    content = content.replace("else.lowerQ", "else")
    with open(path, "w") as f:
        f.write(content)
    print("✨ API route syntax fixed!")
except Exception as e:
    print(f"Note: Could not modify helpdesk route: {e}")
'

echo "[2/5] Restoring standard Prisma generator in schema.prisma..."
python3 -c '
import re
path = "prisma/schema.prisma"
with open(path, "r") as f:
    content = f.read()

content = re.sub(r"generator\s+client\s*\{[^}]*\}", "", content, flags=re.DOTALL)
content = re.sub(r"datasource\s+db\s*\{[^}]*\}", "", content, flags=re.DOTALL)
content = content.replace("\\\"", "\"")

header = "generator client {\n  provider = \"prisma-client-js\"\n}\n\ndatasource db {\n  provider = \"sqlite\"\n  url      = \"file:./dev.db\"\n}\n\n"
content = header + content
with open(path, "w") as f:
    f.write(content)
print("✨ schema.prisma reset to standard generator!")
'

echo "[3/5] Updating src/lib/prisma.ts to standard @prisma/client import..."
mkdir -p src/lib
cat << 'PRISMAEOF' > src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
PRISMAEOF

echo "[4/5] Configuring next.config.js with serverComponentsExternalPackages..."
cat << 'CONFIGEOF' > next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  serverComponentsExternalPackages: ['@prisma/client'],
};

module.exports = nextConfig;
CONFIGEOF

echo "[5/5] Clearing caches, generating client, and starting server..."
rm -rf .next src/generated/client
npx prisma generate
npx prisma db push --accept-data-loss
npm run dev
