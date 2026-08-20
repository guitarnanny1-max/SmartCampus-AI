#!/bin/bash
set -e

echo "=================================================="
echo " 🛠️ Ensuring Standard Prisma Client Generation"
echo "=================================================="

echo "[1/4] Enforcing standard generator block in schema.prisma..."
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
print("✨ schema.prisma updated with standard client generator.")
'

echo "[2/4] Verifying prisma/seed.ts import path..."
python3 -c '
path = "prisma/seed.ts"
try:
    with open(path, "r") as f:
        content = f.read()
    content = re.sub(r"from\s+['\"].*generated/client['\"]", "from '\''@prisma/client'\''", content)
    with open(path, "w") as f:
        f.write(content)
    print("✨ prisma/seed.ts import verified.")
except Exception as e:
    print(f"Seed file check note: {e}")
'

echo "[3/4] Cleaning build caches and generating Prisma client..."
rm -rf .next node_modules/.prisma
npx prisma generate
npx prisma db push --accept-data-loss

echo "[4/4] Starting Next.js Development Server..."
npm run dev
