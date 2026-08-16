#!/bin/bash
set -e
npm install lucide-react clsx tailwind-merge
if [ ! -f .env.local ]; then
  echo "NEXT_PUBLIC_APP_URL=http://localhost:3000" > .env.local
  echo "Created .env.local configuration file."
fi
echo "Setup complete! Starting the development server..."
npm run dev
