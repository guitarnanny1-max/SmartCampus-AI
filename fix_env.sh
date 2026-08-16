#!/bin/bash
if [ ! -f .env.local ]; then
  echo "Creating .env.local file..."
  echo "NEXT_PUBLIC_SUPABASE_URL=https://oipoaxmqyijcvjqxofav.supabase.co” > .env.local
  echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_aDfj8TcyIaX5i9FudXVQag_pdpPnyj0" >> .env.local
  echo "NEXT_PUBLIC_APP_URL=http://localhost:3000" >> .env.local
  echo "Please edit .env.local with your actual Supabase credentials."
else
  echo ".env.local found."
fi

killall node 2>/dev/null
rm -rf .next
npm run dev
