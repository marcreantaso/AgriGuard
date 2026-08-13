@echo off
REM AgriGuard Setup Script for Windows
REM This script automates the setup of both frontend and backend

echo.
echo 🌾 AgriGuard Setup Script
echo ========================
echo.

REM Check Node.js installation
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i

echo ✅ Node.js %NODE_VERSION% found
echo ✅ npm %NPM_VERSION% found
echo.

REM Setup Backend
echo 📦 Setting up Backend Server...
cd server

if not exist ".env" (
    echo 📝 Creating .env from .env.example...
    copy .env.example .env > nul
) else (
    echo ✅ .env already exists
)

echo 📥 Installing backend dependencies...
call npm install

cd ..
echo ✅ Backend setup complete!
echo.

REM Setup Frontend
echo 📦 Setting up Frontend Application...

if not exist ".env" (
    echo 📝 Creating .env...
    (
        echo VITE_API_URL=http://localhost:5000
        echo VITE_APP_NAME=AgriGuard
    ) > .env
) else (
    echo ✅ .env already exists
)

echo 📥 Installing frontend dependencies...
call npm install

echo ✅ Frontend setup complete!
echo.

REM Print completion message
echo ✨ Setup Complete!
echo.
echo 🚀 To start the application:
echo.
echo Terminal 1 - Start Backend Server:
echo   cd server
echo   npm run dev
echo.
echo Terminal 2 - Start Frontend Server:
echo   npm run dev
echo.
echo 🔓 Login with:
echo   Email:    farmer@agri.com
echo   Password: AgriGuard123!
echo.
echo 📖 For detailed instructions, see GETTING_STARTED.md
echo.
pause
