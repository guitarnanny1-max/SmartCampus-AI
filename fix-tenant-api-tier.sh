#!/bin/bash
set -e

echo "=================================================="
echo " 🛠️ Fixing subscriptionTier in Tenants API Route"
echo "=================================================="

python3 -c '
path = "src/app/api/admin/tenants/route.ts"
try:
    with open(path, "r") as f:
        content = f.read()
    
    updated = content.replace("subscriptionTier", "tier")
    
    with open(path, "w") as f:
        f.write(updated)
    print("✨ Replaced subscriptionTier with tier in src/app/api/admin/tenants/route.ts")
except Exception as e:
    print(f"Error: {e}")
'

echo "[1/2] Running Next.js Production Build..."
npm run build

echo "✨ Build completed successfully!"
