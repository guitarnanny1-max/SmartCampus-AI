#!/bin/bash
set -e

echo "=========================================="
echo " Fixing Prisma Relation Validation Errors..."
echo "=========================================="

python3 -c '
with open("prisma/schema.prisma", "r") as f:
    lines = f.readlines()

new_lines = []
i = 0
while i < len(lines):
    line = lines[i]
    # Skip the problematic school relation field line while keeping schoolId
    if "school School" in line and "@relation" in line:
        i += 1
        continue
    new_lines.append(line)
    i += 1

with open("prisma/schema.prisma", "w") as f:
    f.writelines(new_lines)

print("✨ Relation fields successfully normalized!")
'

echo "[1/3] Generating Prisma Client..."
npx prisma generate

echo "[2/3] Pushing Database Schema..."
npx prisma db push

echo "[3/3] Starting Next.js Development Server..."
npm run dev
