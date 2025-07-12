#!/usr/bin/env pwsh
7z x -aoa dist/*.exe -odist/tmp >$null
$asar = Get-ChildItem -Path dist/tmp -Recurse -Filter app.asar | Select-Object -First 1
if (!$asar) { Write-Error "app.asar not found"; exit 1 }
node scripts/verify-preload-in-asar.js $asar.FullName
