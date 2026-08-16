#!/bin/bash

echo "🚀 Setting up SmartCampusAI locally..."

# 1. Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
  echo "Creating .env.local template..."
  cat << 'ENVEOF' > .env.local
NEXT_PUBLIC_SUPABASE_URL=https://oipoaxmqyijcvjqxofav.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_aDfj8TcyIaX5i9FudXVQag_pdpPnyj0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pcG9heG1xeWlqY3ZqcXhvZmF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDYxNTc1OCwiZXhwIjoyMTAwMTkxNzU4fQ.W3ZHd6gn2Il9o2wwP4kbIjYEDJaFxYi4YecAhsb3dIk
RESEND_API_KEY=
ADMIN_NOTIFICATION_EMAIL=info.smartcampusai@gmail.com
ENVEOF
  echo "⚠️ Please update .env.local with your actual Supabase and Resend API keys before running queries."
else
  echo ".env.local already exists."
fi

# 2. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 3. Start development server
echo "✨ Starting local development server..."
npm run dev
