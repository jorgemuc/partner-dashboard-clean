<#
  Usage:
    pwsh scripts/verify-preload-in-portable.ps1 <PortableExe>
  Exit 0  →  dist/preload.js steckt im ASAR
  Exit 1  →  nicht drin / Fehler
#>

param([Parameter(Mandatory=$true)][string]$PortableExe)
$ErrorActionPreference = 'Stop'

$tmp  = 'dist\extracted'
$tmp2 = 'dist\inner'
Remove-Item $tmp,$tmp2 -Recurse -Force -EA SilentlyContinue
New-Item   $tmp,$tmp2 -ItemType Directory | Out-Null

# Ebene 1: app-64.7z aus dem Portable-EXE holen
7z e -aoa "$PortableExe" 'app-64.7z' -o"$tmp" | Out-Null

# Ebene 2: resources/app.asar aus app-64.7z holen
7z e -aoa "$tmp\app-64.7z" 'resources/app.asar' -o"$tmp2" | Out-Null

$asar = Join-Path $tmp2 'app.asar'
if (-not (Test-Path $asar)) { Write-Error 'app.asar not found'; exit 1 }

node scripts/verify-preload-in-asar.js $asar
exit $LASTEXITCODE
