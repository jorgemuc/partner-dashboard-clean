#!/usr/bin/env pwsh
$dest = "dist/extracted"
Remove-Item $dest -Recurse -ErrorAction SilentlyContinue
New-Item $dest -ItemType Directory | Out-Null

$exe = Get-ChildItem dist -Filter *.exe | Select-Object -First 1
7z e $exe.FullName app-64.7z -o$dest >$null
7z e "$dest/app-64.7z" resources/app.asar -o$dest >$null

$asarPath = Join-Path $dest "resources/app.asar"
if (Test-Path $asarPath) {
  node scripts/verify-preload-in-asar.js $asarPath
  exit $LASTEXITCODE
}
Write-Error "app.asar not found"
exit 1
