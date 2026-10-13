@echo off
echo Installing dependencies for Movie Theater website...
cd /d "%~dp0"
npm install
echo.
echo Dependencies installed successfully!
echo To start the development server, run: npm start
pause
