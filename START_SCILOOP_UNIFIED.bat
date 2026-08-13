@echo off
setlocal
title SciLoop Unified Launcher
cd /d "%~dp0"

echo Starting SciLoop services and opening the platform...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\start-sciloop.ps1"
if errorlevel 1 (
  echo.
  echo SciLoop could not start completely. Review .sciloop-runtime\logs\*.err.log
  pause
  exit /b 1
)

echo.
echo SciLoop is ready.
timeout /t 3 >nul
endlocal
