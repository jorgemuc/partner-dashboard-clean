<#
  Usage:
    pwsh scripts/verify-preload-in-portable.ps1 <PortableExe>
  Exit 0  →  dist/preload.js steckt im ASAR
  Exit 1  →  nicht drin / Fehler
#>

param([Parameter(Mandatory=$true)][string]$PortableExe)
$ErrorActionPreference = 'Stop'


$tmp    = 'dist\extracted'
$tmp2   = 'dist\inner'
Remove-Item $tmp,$tmp2 -Recurse -Force -EA SilentlyContinue
New-Item   $tmp,$tmp2 -ItemType Directory | Out-Null

# direct extraction for modern portable builds
7z e -aoa "$PortableExe" 'resources/app.asar' -o"$tmp" | Out-Null

$asar = Join-Path $tmp 'app.asar'
if (-not (Test-Path $asar)) {
  # fallback: app-64.7z nested archive (legacy)
  7z e -aoa "$PortableExe" 'app-64.7z' -o"$tmp2" | Out-Null
  7z e -aoa "$tmp2\app-64.7z" 'resources/app.asar' -o"$tmp" | Out-Null
  if (-not (Test-Path $asar)) { Write-Error 'app.asar not found'; exit 1 }
}

node scripts/verify-preload-in-asar.js $asar
exit $LASTEXITCODE
