#!/bin/bash
set -e

echo "=========================================="
echo " Cleaning Duplicate Prisma Models..."
echo "=========================================="

python3 -c '
with open("prisma/schema.prisma", "r") as f:
    lines = f.readlines()

new_lines = []
seen_models = set()
i = 0
while i < len(lines):
    line = lines[i]
    if line.strip().startswith("model "):
        parts = line.strip().split()
        if len(parts) > 1:
            model_name = parts[1]
            if model_name in seen_models:
                # Skip duplicate model block until the closing brace
                i += 1
                while i < len(lines) and not lines[i].strip().startswith("}"):
                    i += 1
                i += 1 # skip closing brace line
                continue
            else:
                seen_models.add(model_name)
    new_lines.append(line)
    i += 1

with open("prisma/schema.prisma", "w") as f:
    f.writelines(new_lines)

print("✨ Duplicate models successfully removed from schema.prisma!")
'

echo "[1/3] Generating Prisma Client..."
npx prisma generate

echo "[2/3] Pushing Database Schema..."
npx prisma db push

echo "[3/3] Starting Next.js Development Server..."
npm run dev
