#!/bin/bash

# Firefly Tracker App - Setup Script
# This script helps set up the project for development

echo "🦟 Firefly Tracker App - Setup Script"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

echo ""
echo "🔧 Setting up environment files..."

# Copy .env.example files if .env doesn't exist
if [ ! -f frontend/.env ]; then
    cp frontend/.env.example frontend/.env
    echo "✅ Created frontend/.env from .env.example"
else
    echo "⚠️  frontend/.env already exists, skipping..."
fi

if [ ! -f supabase/.env ]; then
    cp supabase/.env.example supabase/.env
    echo "✅ Created supabase/.env from .env.example"
else
    echo "⚠️  supabase/.env already exists, skipping..."
fi

echo ""
echo "📝 Next steps:"
echo "1. Edit frontend/.env and supabase/.env with your remote Supabase project values"
echo "2. Get your Supabase URL and keys from: https://app.supabase.com/project/_/settings/api"
echo "3. (Optional) Get a Mapbox token from: https://www.mapbox.com/"
echo ""
echo "🚀 To start development:"
echo "   - Frontend: npm run dev:frontend"
echo "   - Functions: npm run dev:functions (requires Supabase CLI)"
echo ""
echo "✅ Setup complete!"