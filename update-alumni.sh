#!/bin/bash
set -e

echo "=================================================="
echo " 🛠️ Updating AlumniEndowment Schema & Rebuilding..."
echo "=================================================="

# Create/overwrite the updated schema snippet or ensure it's written properly
# (Make sure your prisma/schema.prisma contains the gradYear and campaign fields in AlumniEndowment)

# 1. Clean caches
rm -rf .next
rm -rf node_modules/.prisma

# 2. Push schema changes to SQLite database
npx prisma db push --accept-data-loss

# 3. Regenerate Prisma Client TypeScript types
npx prisma generate

# 4. Run Next.js production build
npm run build

echo "✨ Build completed successfully!"
