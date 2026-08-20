#!/bin/bash
set -e

echo "=================================================="
echo " 🛠️ Fixing remaining subscriptionTier references in Admin Schools Page"
echo "=================================================="

python3 -c '
path = "src/app/admin/schools/page.tsx"
try:
    with open(path, "r") as f:
        content = f.read()
    
    # Replace all instances of subscriptionTier with tier
    updated = content.replace("subscriptionTier", "tier")
    
    with open(path, "w") as f:
        f.write(updated)
    print("✨ Replaced all subscriptionTier references with tier in src/app/admin/schools/page.tsx successfully.")
except Exception as e:
    print(f"Error updating file: {e}")
'

echo "[1/2] Running Next.js Production Build..."
npm run build

echo "✨ Build completed successfully!"
