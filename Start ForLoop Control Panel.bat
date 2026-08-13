@echo off
setlocal
title ForLoop Control Panel Launcher
cd /d "%~dp0"

echo Starting the complete SciLoop platform so ForLoop is ready automatically...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\start-sciloop.ps1" -SkipChrome
if errorlevel 1 (
  echo.
  echo ForLoop could not start completely. Review .sciloop-runtime\logs\*.err.log
  pause
  exit /b 1
)

echo ForLoop API is ready. The private control panel still requires its admin code.
start "" "http://localhost:3010/sciloop-live?forloop=1#news"
endlocal
