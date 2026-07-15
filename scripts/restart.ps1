param(
  [switch]$Build,
  [ValidateSet("all", "api", "web")]
  [string]$Target = "all"
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

# Determine which services to restart
$services = switch ($Target) {
  "api"  { "postgres api" }
  "web"  { "web" }
  "all"  { "postgres api web" }
}

Write-Host "Stopping [$services]..."
Invoke-WslCommand "cd '$repoRootWsl' && docker compose stop $services"

if ($Build) {
  Write-Host "Rebuilding and starting [$services]..."
  Invoke-WslCommand "cd '$repoRootWsl' && docker compose up --build -d $services"
} else {
  Write-Host "Starting [$services]..."
  Invoke-WslCommand "cd '$repoRootWsl' && docker compose up -d $services"
}

Write-Host ""
Write-Host "Done. Services running:"
Invoke-WslCommand "cd '$repoRootWsl' && docker compose ps --format 'table {{.Name}}\t{{.Status}}\t{{.Ports}}'"
