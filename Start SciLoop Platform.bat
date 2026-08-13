@echo off
setlocal
title SciLoop Platform Launcher
cd /d "%~dp0"

echo Starting the complete SciLoop platform...
echo ForLoop, SciLoop AI, and the frontend will start automatically.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\start-sciloop.ps1"
if errorlevel 1 (
  echo.
  echo SciLoop could not start completely. Review .sciloop-runtime\logs\*.err.log
  pause
  exit /b 1
)

endlocal
