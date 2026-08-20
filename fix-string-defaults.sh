#!/bin/bash
set -e

echo "=================================================="
echo " 🛠️ Fixing Unquoted Defaults on String Fields"
echo "=================================================="

python3 -c '
import re

path = "prisma/schema.prisma"
with open(path, "r") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    # If the line defines a String field with a default value
    if "String" in line and "@default(" in line:
        match = re.search(r"@default\(([^)]+)\)", line)
        if match:
            val = match.group(1).strip()
            # If the value is not quoted, not a function call like uuid(), and not boolean
            if not (val.startswith("\"") or val.startswith("\x27")) and not val.endswith("()") and val.lower() not in ["true", "false"]:
                line = line.replace(f"@default({val})", f"@default(\"{val}\")")
    new_lines.append(line)

with open(path, "w") as f:
    f.writelines(new_lines)

print("✨ All unquoted String defaults successfully corrected!")
'

echo "[1/3] Generating Prisma Client..."
npx prisma generate

echo "[2/3] Pushing database schema..."
npx prisma db push --accept-data-loss

echo "[3/3] Starting Next.js Development Server..."
npm run dev
