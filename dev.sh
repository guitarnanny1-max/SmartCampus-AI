#!/bin/bash
set -e

echo "🚀 Starting Smart Campus AI Development Environment Setup..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js before proceeding."
    exit 1
fi

echo "✅ Node version: $(node -v)"
echo "✅ npm version: $(npm -v)"

if [ ! -f .env.local ]; then
    if [ -f .env.example ]; then
        echo "⚠️ .env.local not found. Copying from .env.example..."
        cp .env.example .env.local
        echo "📝 Please update .env.local with your credentials."
    else
        echo "❌ Error: Neither .env.local nor .env.example found."
        exit 1
    fi
else
    echo "✅ Environment file (.env.local) found."
fi

if [ ! -d "node_modules" ] || [ package.json -nt node_modules ]; then
    echo "📦 Installing project dependencies..."
    npm install
else
    echo "✅ Dependencies are up to date."
fi

echo "🔥 Launching Next.js development server..."
npm run dev
