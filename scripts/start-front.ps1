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
  Write-Host "Starting frontend with build (web only)..."
  Invoke-WslCommand "cd '$repoRootWsl' && docker compose up --build -d --no-deps web"
} else {
  Write-Host "Starting frontend (web only)..."
  Invoke-WslCommand "cd '$repoRootWsl' && docker compose up -d --no-deps web"
}

Write-Host "Frontend ready on: http://localhost:5173"
