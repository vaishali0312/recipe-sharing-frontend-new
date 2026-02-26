@echo off
cd /d c:\Users\Vaishali Shenisetti\recipe-sharing-frontend\backend
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
start cmd /k "node server.js"
