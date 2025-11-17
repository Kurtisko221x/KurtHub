@echo off
echo ====================================
echo   AI Studio - Rodinny Projekt
echo ====================================
echo.

echo Kontrolujem zavislosti...
call npm install
echo.

echo Spustam server...
echo.
node server.js

pause

