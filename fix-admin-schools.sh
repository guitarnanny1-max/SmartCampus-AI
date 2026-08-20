#!/bin/bash
set -e

echo "=================================================="
echo " 🛠️ Fixing subscriptionTier Reference in Admin Schools Page"
echo "=================================================="

python3 -c '
path = "src/app/admin/schools/page.tsx"
try:
    with open(path, "r") as f:
        content = f.read()
    
    # Replace the incorrect property reference
    updated = content.replace("s.subscriptionTier", "s.tier")
    
    with open(path, "w") as f:
        f.write(updated)
    print("✨ Updated src/app/admin/schools/page.tsx successfully.")
except Exception as e:
    print(f"Error updating file: {e}")
'

echo "[1/2] Running Next.js Production Build..."
npm run build

echo "✨ Build completed successfully! All admin dashboard type checks passed."
