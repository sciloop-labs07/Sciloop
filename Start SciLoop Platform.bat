@echo off
setlocal
title SciLoop Platform Launcher

set "ROOT=%~dp0"
set "SERVER_DIR=%ROOT%server"
set "HTML_FILE=%ROOT%SciLoop - Live Scientific Discoveries 80.html"
set "LOG_FILE=%SERVER_DIR%\server.log"
set "ERR_FILE=%SERVER_DIR%\server.err.log"

echo Starting SciLoop platform...

if not exist "%SERVER_DIR%\index.js" (
  echo SciLoop API server files were not found.
  echo Expected: "%SERVER_DIR%\index.js"
  pause
  exit /b 1
)

if not exist "%HTML_FILE%" (
  echo Main SciLoop HTML file was not found.
  echo Expected: "%HTML_FILE%"
  pause
  exit /b 1
)

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required but was not found.
  echo Install Node.js once, then run this launcher again.
  pause
  exit /b 1
)

if not exist "%SERVER_DIR%\node_modules" (
  echo Installing SciLoop API packages. This happens only if node_modules is missing.
  pushd "%SERVER_DIR%"
  call npm install
  if errorlevel 1 (
    popd
    echo npm install failed.
    pause
    exit /b 1
  )
  popd
)

powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r = Invoke-RestMethod -Uri 'http://localhost:3001/' -TimeoutSec 2; if ($r.ok) { exit 0 } } catch {}; exit 1"
if errorlevel 1 (
  echo Starting SciLoop News Explanation API on http://localhost:3001 ...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "$server='%SERVER_DIR%'; $out='%LOG_FILE%'; $err='%ERR_FILE%'; Start-Process -FilePath 'node' -ArgumentList 'index.js' -WorkingDirectory $server -WindowStyle Hidden -RedirectStandardOutput $out -RedirectStandardError $err"
)

echo Waiting for SciLoop API...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ready=$false; for($i=0; $i -lt 30; $i++){ try { $r = Invoke-RestMethod -Uri 'http://localhost:3001/' -TimeoutSec 1; if($r.ok){ $ready=$true; break } } catch {}; Start-Sleep -Milliseconds 600 }; if($ready){ exit 0 } else { exit 1 }"
if errorlevel 1 (
  echo SciLoop API did not start. Check server\server.err.log for details.
  pause
  exit /b 1
)

echo Opening SciLoop...
start "" "%HTML_FILE%"
echo SciLoop is ready. You can close this launcher window.
timeout /t 3 >nul
exit /b 0
