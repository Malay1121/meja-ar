@echo off
echo 🔧 MejaAR Admin Panel - Quick Setup & Fix
echo ========================================

echo 📁 Navigating to admin panel directory...
cd /d "%~dp0"

echo 🧹 Cleaning up node_modules and package-lock...
if exist "node_modules" rmdir /s /q "node_modules"
if exist "package-lock.json" del "package-lock.json"

echo 📦 Installing dependencies with latest versions...
npm install

echo ✅ Setup complete!
echo.
echo 🚀 To start the admin panel:
echo    npm run dev
echo.
echo 🔐 Demo login credentials:
echo    Email: demo@restaurant.com
echo    Password: demo123
echo.
echo 🌐 Admin panel will be available at:
echo    http://localhost:3001
echo.
pause