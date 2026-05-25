@echo off
setlocal
title Stop SciLoop API

echo Stopping SciLoop API on port 3001...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$connections = Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue; if(!$connections){ Write-Host 'SciLoop API is not running.'; exit 0 }; foreach($conn in $connections){ $proc = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue; if($proc -and $proc.ProcessName -eq 'node'){ Stop-Process -Id $proc.Id -Force; Write-Host ('Stopped node process ' + $proc.Id) } }"
timeout /t 2 >nul
exit /b 0
