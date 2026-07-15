param(
  [switch]$Build
)

$ErrorActionPreference = "Stop"

function Convert-WindowsPathToWsl([string]$windowsPath) {
  $resolved = (Resolve-Path $windowsPath).Path
  $drive = $resolved.Substring(0, 1).ToLowerInvariant()
  $rest = $resolved.Substring(2).Replace('\', '/')
  return "/mnt/$drive$rest"
}

function Invoke-WslCommand([string]$command) {
  wsl -e bash -lc $command
  if ($LASTEXITCODE -ne 0) {
    throw "WSL command failed: $command"
  }
}

function Ensure-WslKeepAlive() {
  # Spawn a Windows-side wsl.exe process; while it exists WSL cannot auto-stop
  $running = Get-CimInstance Win32_Process -Filter "Name='wsl.exe'" |`
    Where-Object { $_.CommandLine -match 'sleep\s+infinity' } |`
    Select-Object -First 1
  if (-not $running) {
    Start-Process -FilePath "wsl.exe" -ArgumentList "-e", "sleep", "infinity" -WindowStyle Hidden
  }
}

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$repoRootWsl = Convert-WindowsPathToWsl $repoRoot

Write-Host "Starting Docker service in WSL..."
Invoke-WslCommand "service docker start >/dev/null 2>&1 || true"
Ensure-WslKeepAlive

if ($Build) {
  Write-Host "Starting backend with build (postgres + api)..."
  Invoke-WslCommand "cd '$repoRootWsl' && docker compose up --build -d postgres api"
} else {
  Write-Host "Starting backend (postgres + api)..."
  Invoke-WslCommand "cd '$repoRootWsl' && docker compose up -d postgres api"
}

Write-Host "Backend ready on: http://localhost:3000"
