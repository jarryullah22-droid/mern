@echo off
cd /d "%~dp0"
echo === Movie Theater - seed database ===
echo.

if not exist ".env" (
  echo No .env file found in this folder ^(backend^).
  echo Create backend\.env with these two lines:
  echo.
  echo   MONGODB_URI=mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/movie_theater
  echo   JWT_SECRET=some_long_random_string
  echo.
  echo Use the SAME MONGODB_URI that your backend uses on Vercel.
  pause
  exit /b 1
)

call npm install
call node seed.js
echo.
pause
