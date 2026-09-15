param(
  [switch]$SkipChrome,
  [int]$FrontendPort = 3010
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$RuntimeDir = Join-Path $Root ".sciloop-runtime"
$LogDir = Join-Path $RuntimeDir "logs"
$FrontendUrl = "http://localhost:$FrontendPort/sciloop-live"

New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

function Test-Endpoint([string]$Url, [int]$TimeoutSec = 5) {
  try {
    $response = Invoke-WebRequest -UseBasicParsing -Uri $Url -TimeoutSec $TimeoutSec
    return $response.StatusCode -ge 200 -and $response.StatusCode -lt 400
  } catch {
    return $false
  }
}

function Test-PortInUse([int]$Port) {
  return [bool](Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue)
}

function Ensure-NodeDependencies {
  param(
    [string]$Name,
    [string]$WorkingDirectory
  )

  $packageJson = Join-Path $WorkingDirectory "package.json"
  $nodeModules = Join-Path $WorkingDirectory "node_modules"
  if (-not (Test-Path $packageJson)) {
    throw "$Name package.json is missing: $packageJson"
  }
  if (Test-Path $nodeModules) {
    return
  }

  Write-Host "Installing $Name packages (first launch only)..." -ForegroundColor Cyan
  Push-Location $WorkingDirectory
  try {
    & npm.cmd install --no-audit --no-fund
    if ($LASTEXITCODE -ne 0) {
      throw "$Name dependency installation failed."
    }
  } finally {
    Pop-Location
  }
}

function Start-ManagedService {
  param(
    [string]$Name,
    [string]$WorkingDirectory,
    [string]$FilePath,
    [string[]]$ArgumentList,
    [string]$HealthUrl,
    [int]$Port
  )

  if (Test-Endpoint $HealthUrl) {
    Write-Host "$Name is already online: $HealthUrl" -ForegroundColor DarkGreen
    return
  }

  if (-not (Test-Path $WorkingDirectory)) {
    throw "$Name working directory is missing: $WorkingDirectory"
  }

  if (Test-PortInUse $Port) {
    for ($attempt = 0; $attempt -lt 3; $attempt++) {
      Start-Sleep -Milliseconds 750
      if (Test-Endpoint $HealthUrl 2) {
        Write-Host "$Name is already online: $HealthUrl" -ForegroundColor DarkGreen
        return
      }
    }
    throw "$Name is not healthy and port $Port is already occupied by another process. Check $HealthUrl"
  }

  $safeName = $Name.ToLowerInvariant().Replace(" ", "-")
  $stdout = Join-Path $LogDir "$safeName.out.log"
  $stderr = Join-Path $LogDir "$safeName.err.log"
  Write-Host "Starting $Name..." -ForegroundColor Cyan
  Start-Process -FilePath $FilePath -ArgumentList $ArgumentList -WorkingDirectory $WorkingDirectory -WindowStyle Hidden -RedirectStandardOutput $stdout -RedirectStandardError $stderr | Out-Null

  for ($attempt = 0; $attempt -lt 40; $attempt++) {
    Start-Sleep -Milliseconds 750
    if (Test-Endpoint $HealthUrl) {
      Write-Host "$Name is ready." -ForegroundColor Green
      return
    }
  }

  throw "$Name did not become healthy. Check $stderr"
}

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  throw "Node.js is required but was not found on PATH."
}
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  throw "npm is required but was not found on PATH."
}

$serverDirectory = Join-Path $Root "server"
$aiDirectory = Join-Path $Root "sciloop-backend"
Ensure-NodeDependencies -Name "ForLoop Control API" -WorkingDirectory $serverDirectory
Ensure-NodeDependencies -Name "SciLoop AI Backend" -WorkingDirectory $aiDirectory
Ensure-NodeDependencies -Name "SciLoop frontend" -WorkingDirectory $Root

Start-ManagedService -Name "ForLoop Control API" -WorkingDirectory $serverDirectory -FilePath "node" -ArgumentList @("index.js") -HealthUrl "http://localhost:3001/api/health" -Port 3001
Start-ManagedService -Name "SciLoop AI Backend" -WorkingDirectory $aiDirectory -FilePath "npm.cmd" -ArgumentList @("run", "start") -HealthUrl "http://localhost:5050/health" -Port 5050
Start-ManagedService -Name "SciLoop Next Frontend" -WorkingDirectory $Root -FilePath "npm.cmd" -ArgumentList @("run", "dev", "--", "-p", "$FrontendPort") -HealthUrl "http://localhost:$FrontendPort/api/system-status" -Port $FrontendPort

if (-not $SkipChrome) {
  $chromeCandidates = @(
    (Join-Path $env:ProgramFiles "Google\Chrome\Application\chrome.exe"),
    (Join-Path ${env:ProgramFiles(x86)} "Google\Chrome\Application\chrome.exe")
  )
  $chrome = $chromeCandidates | Where-Object { $_ -and (Test-Path $_) } | Select-Object -First 1
  if ($chrome) {
    Start-Process -FilePath $chrome -ArgumentList $FrontendUrl
  } else {
    Start-Process $FrontendUrl
  }
}

Write-Host "SciLoop is ready: $FrontendUrl" -ForegroundColor Green
