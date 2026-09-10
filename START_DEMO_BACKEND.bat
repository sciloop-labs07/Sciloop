@echo off
setlocal
cd /d "%~dp0server"

if not exist ".env" (
  copy ".env.example" ".env" >nul
  echo Created server\.env from template. Paste API keys into server\.env for real AI provider calls.
)

if not exist "node_modules" (
  echo Installing backend dependencies...
  call npm install
)

echo Starting SciLoop ForLoop API backend on http://localhost:3001
echo Access code: 123456
start "" "http://localhost:3001/forloop-control-panel/"
call npm start
