#!/bin/bash
set -e

echo "=================================================="
echo " 🛠️ Excluding prisma/seed.ts from Next.js Build"
echo "=================================================="

python3 -c '
import json, os

path = "tsconfig.json"
if os.path.exists(path):
    with open(path, "r") as f:
        # Handle potential comments in tsconfig.json using basic parsing or json load
        text = f.read()
    
    # Simple JSON load if standard, or we can inject exclude safely
    try:
        data = json.loads(text)
    except Exception:
        # If comments exist, let us parse or fallback to standard structure injection
        import re
        # Remove comments for clean parsing
        text_no_comments = re.sub(r"//.*|/\*[\s\S]*?\*/", "", text)
        data = json.loads(text_no_comments)

    data["exclude"] = data.get("exclude", [])
    if "prisma/seed.ts" not in data["exclude"]:
        data["exclude"].append("prisma/seed.ts")
    if "prisma" not in data["exclude"]:
        data["exclude"].append("prisma")

    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print("✨ tsconfig.json updated successfully!")
else:
    print("tsconfig.json not found, skipping exclude modification.")
'

echo "[1/3] Clearing old build caches..."
rm -rf .next

echo "[2/3] Generating fresh Prisma Client..."
npx prisma generate

echo "[3/3] Running Production Build..."
npm run build
