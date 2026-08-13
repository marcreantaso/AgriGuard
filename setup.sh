#!/bin/bash

# AgriGuard Setup Script for macOS/Linux
# This script automates the setup of both frontend and backend

echo "🌾 AgriGuard Setup Script"
echo "========================"
echo ""

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) found"
echo "✅ npm $(npm -v) found"
echo ""

# Setup Backend
echo "📦 Setting up Backend Server..."
cd server || exit 1

if [ ! -f ".env" ]; then
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
else
    echo "✅ .env already exists"
fi

echo "📥 Installing backend dependencies..."
npm install

cd ..
echo "✅ Backend setup complete!"
echo ""

# Setup Frontend
echo "📦 Setting up Frontend Application..."

if [ ! -f ".env" ]; then
    echo "📝 Creating .env..."
    cat > .env << EOF
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=AgriGuard
EOF
else
    echo "✅ .env already exists"
fi

echo "📥 Installing frontend dependencies..."
npm install

echo "✅ Frontend setup complete!"
echo ""

# Print completion message
echo "✨ Setup Complete!"
echo ""
echo "🚀 To start the application:"
echo ""
echo "Terminal 1 - Start Backend Server:"
echo "  cd server && npm run dev"
echo ""
echo "Terminal 2 - Start Frontend Server:"
echo "  npm run dev"
echo ""
echo "🔓 Login with:"
echo "  Email:    farmer@agri.com"
echo "  Password: AgriGuard123!"
echo ""
echo "📖 For detailed instructions, see GETTING_STARTED.md"
echo ""
