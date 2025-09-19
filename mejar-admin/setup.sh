#!/bin/bash

# MejaAR Admin Panel Setup Script
echo "🍽️  Setting up MejaAR Admin Panel..."
echo "======================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ required. Current version: $(node -v)"
    echo "   Please upgrade Node.js from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Setup environment file
if [ ! -f ".env.local" ]; then
    echo "⚙️  Setting up environment configuration..."
    cp .env.example .env.local
    echo "✅ Created .env.local file"
    echo "📝 Please edit .env.local with your Firebase configuration"
else
    echo "✅ Environment file already exists"
fi

# Create initial directories if they don't exist
mkdir -p public/images
mkdir -p public/models
mkdir -p src/components/ui
mkdir -p src/hooks

echo "✅ Project structure created"

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "🔧 Firebase CLI not found. Installing..."
    npm install -g firebase-tools
    echo "✅ Firebase CLI installed"
else
    echo "✅ Firebase CLI already installed"
fi

echo ""
echo "🎉 MejaAR Admin Panel setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Edit .env.local with your Firebase configuration"
echo "   2. Run 'npm run dev' to start development server"
echo "   3. Open http://localhost:3001 in your browser"
echo ""
echo "📚 Need help? Check README.md for detailed instructions"
echo ""
echo "🔐 Demo login credentials:"
echo "   Email: demo@restaurant.com"
echo "   Password: demo123"
echo ""
echo "Happy coding! 🚀"