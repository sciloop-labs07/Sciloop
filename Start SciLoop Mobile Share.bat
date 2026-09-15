@echo off
setlocal
title SciLoop Mobile Share Launcher

set "ROOT=%~dp0"
set "AI_DIR=%ROOT%sciloop-backend"
set "FORLOOP_DIR=%ROOT%server"
set "CLOUDFLARED=%ROOT%cloudflared.exe"

echo.
echo ===============================================
echo   SciLoop Mobile Share
echo ===============================================
echo This starts:
echo   1. SciLoop frontend on http://localhost:3000
echo   2. SciLoop AI backend on http://localhost:5050
echo   3. ForLoop backend on http://localhost:3001
echo   4. Cloudflare Tunnel for phone / WhatsApp access
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Install Node.js first.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo npm was not found. Install Node.js first.
  pause
  exit /b 1
)

if not exist "%CLOUDFLARED%" (
  echo cloudflared.exe was not found at:
  echo "%CLOUDFLARED%"
  echo.
  echo Download Cloudflare Tunnel or place cloudflared.exe in this folder.
  pause
  exit /b 1
)

if not exist "%ROOT%node_modules" (
  echo Installing frontend dependencies...
  pushd "%ROOT%"
  call npm install
  if errorlevel 1 (
    popd
    echo Frontend npm install failed.
    pause
    exit /b 1
  )
  popd
)

if not exist "%AI_DIR%node_modules" (
  echo Installing SciLoop AI backend dependencies...
  pushd "%AI_DIR%"
  call npm install
  if errorlevel 1 (
    popd
    echo SciLoop AI backend npm install failed.
    pause
    exit /b 1
  )
  popd
)

echo.
echo Starting SciLoop AI backend on port 5050...
start "SciLoop AI Backend 5050" cmd /k "cd /d "%AI_DIR%" && npm run start"

echo Starting ForLoop backend on port 3001...
start "ForLoop Backend 3001" cmd /k "cd /d "%ROOT%" && node server/index.js"

echo Starting SciLoop frontend on all network interfaces...
start "SciLoop Frontend 3000" cmd /k "cd /d "%ROOT%" && npm run dev:share"

echo.
echo Waiting a few seconds before opening tunnel...
timeout /t 8 >nul

echo.
echo Starting Cloudflare Tunnel...
echo.
echo IMPORTANT:
echo Copy the https://....trycloudflare.com URL shown below.
echo Send this to your team on WhatsApp:
echo.
echo   https://YOUR-CLOUDFLARE-URL/sciloop-live
echo.
echo Keep this window open while your team uses SciLoop on phone.
echo.
"%CLOUDFLARED%" tunnel --url http://localhost:3000

pause
