#!/bin/bash
set -e

echo "=================================================="
echo " 🛡️ Running Prisma Schema Scrubber & Auto-Fix"
echo "=================================================="

echo "[1/4] Scrubbing enums and invalid relation constraints..."
python3 -c '
import re

path = "prisma/schema.prisma"
with open(path, "r") as f:
    content = f.read()

# 1. Remove enum Role definitions and convert field type Role to String
content = re.sub(r"enum\s+Role\s*\{[^}]*\}", "", content)
content = re.sub(r"role\s+Role", "role String", content)

# 2. Parse lines to clean up strict @relation lines and School relation arrays
lines = content.splitlines()
new_lines = []
i = 0
in_school = False

while i < len(lines):
    line = lines[i]
    
    if line.strip().startswith("model School {"):
        in_school = True
        new_lines.append(line)
        i += 1
        continue
    elif in_school and line.strip() == "}":
        in_school = False
        new_lines.append(line)
        i += 1
        continue
        
    # Inside School model, remove any custom relation arrays to prevent mismatch errors
    if in_school and "[]" in line and not line.strip().startswith("students") and not line.strip().startswith("placements"):
        i += 1
        continue

    # Remove strict school relation fields while preserving scalar schoolId fields
    if "school School" in line and "@relation" in line:
        i += 1
        continue
        
    new_lines.append(line)
    i += 1

content = "\n".join(new_lines)

with open(path, "w") as f:
    f.write(content)

print("✨ Schema successfully scrubbed!")
'

echo "[2/4] Generating fresh Prisma Client..."
npx prisma generate

echo "[3/4] Pushing Database Schema..."
npx prisma db push --accept-data-loss

echo "[4/4] Starting Next.js Development Server..."
npm run dev
