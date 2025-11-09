@echo off
echo 🏗️  Setting up Event Management Platform - Floor Plan Editor
echo ==========================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    echo    Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% equ 0 (
    echo ✅ Dependencies installed successfully
) else (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file...
    (
        echo # Environment variables for Event Management Platform
        echo VITE_APP_TITLE=Event Management Platform
        echo VITE_APP_VERSION=1.0.0
    ) > .env
    echo ✅ .env file created
)

echo.
echo 🎉 Setup complete!
echo.
echo To start the development server, run:
echo   npm run dev
echo.
echo To build for production, run:
echo   npm run build
echo.
echo Happy floor planning! 🏠
pause
