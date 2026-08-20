#!/bin/bash
set -e

echo "=================================================="
echo " 🛠️ Normalizing Prisma Schema for v5.22.0 Compatibility"
echo "=================================================="

python3 -c '
import re

path = "prisma/schema.prisma"
with open(path, "r") as f:
    content = f.read()

# Remove any existing generator and datasource blocks to prevent duplication/corruption
content = re.sub(r"generator\s+client\s*\{[^}]*\}", "", content, flags=re.DOTALL)
content = re.sub(r"datasource\s+db\s*\{[^}]*\}", "", content, flags=re.DOTALL)

# Insert clean, standard Prisma 5 generator and datasource blocks at the top
header = """generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

"""
content = header + content
content = content.replace("\\\"", "\"")

# Clean and wrap unquoted string defaults properly
def fix_default(match):
    val = match.group(1).strip()
    if (val.startswith("\"") and val.endswith("\"")) or (val.startswith("\x27") and val.endswith("\x27")):
        return f"@default({val})"
    if val.lower() in ["true", "false"] or val.isdigit() or val.replace(".", "", 1).isdigit() or "autoincrement()" in val or "now()" in val or "uuid()" in val or "cuid()" in val:
        return f"@default({val})"
    return f"@default(\"{val}\")"

content = re.sub(r"@default\s*\(([^)]+)\)", fix_default, content)

with open(path, "w") as f:
    f.write(content)

print("✨ Schema successfully rewritten and normalized for Prisma 5!")
'

echo "[1/3] Generating Prisma Client..."
npx prisma generate

echo "[2/3] Pushing Database Schema..."
npx prisma db push --accept-data-loss

echo "[3/3] Starting Next.js Development Server..."
npm run dev
