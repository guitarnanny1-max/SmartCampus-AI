#!/bin/bash
set -e

echo "=================================================="
echo " 🛠️ Correcting Unbalanced Parentheses in Schema"
echo "=================================================="

python3 -c '
import re

path = "prisma/schema.prisma"
with open(path, "r") as f:
    content = f.read()

# Fix unclosed parentheses for default functions
content = content.replace("@default(uuid()", "@default(uuid())")
content = content.replace("@default(now()", "@default(now())")
content = content.replace("@default(cuid()", "@default(cuid())")
content = content.replace("@default(autoincrement()", "@default(autoincrement())")

# Clean any trailing duplicate closing parentheses if they were introduced
content = re.sub(r"@default\((uuid\(\)\))\)", "@default(uuid())", content, flags=re.IGNORECASE)
content = re.sub(r"@default\((now\(\)\))\)", "@default(now())", content, flags=re.IGNORECASE)

with open(path, "w") as f:
    f.write(content)

print("✨ Schema default parentheses successfully fixed!")
'

echo "[1/3] Generating Prisma Client..."
npx prisma generate

echo "[2/3] Pushing database schema..."
npx prisma db push --accept-data-loss

echo "[3/3] Starting Next.js Development Server..."
npm run dev
