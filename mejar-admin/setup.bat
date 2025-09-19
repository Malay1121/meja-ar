@echo off
:: MejaAR Admin Panel Setup Script for Windows
echo 🍽️  Setting up MejaAR Admin Panel...
echo =======================================

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected

:: Install dependencies
echo 📦 Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

:: Setup environment file
if not exist ".env.local" (
    echo ⚙️  Setting up environment configuration...
    copy .env.example .env.local
    echo ✅ Created .env.local file
    echo 📝 Please edit .env.local with your Firebase configuration
) else (
    echo ✅ Environment file already exists
)

:: Create initial directories
mkdir public\images 2>nul
mkdir public\models 2>nul
mkdir src\components\ui 2>nul
mkdir src\hooks 2>nul

echo ✅ Project structure created

:: Check if Firebase CLI is installed
where firebase >nul 2>nul
if %errorlevel% neq 0 (
    echo 🔧 Firebase CLI not found. Installing...
    npm install -g firebase-tools
    echo ✅ Firebase CLI installed
) else (
    echo ✅ Firebase CLI already installed
)

echo.
echo 🎉 MejaAR Admin Panel setup complete!
echo.
echo 📋 Next steps:
echo    1. Edit .env.local with your Firebase configuration
echo    2. Run 'npm run dev' to start development server
echo    3. Open http://localhost:3001 in your browser
echo.
echo 📚 Need help? Check README.md for detailed instructions
echo.
echo 🔐 Demo login credentials:
echo    Email: demo@restaurant.com
echo    Password: demo123
echo.
echo Happy coding! 🚀
pause