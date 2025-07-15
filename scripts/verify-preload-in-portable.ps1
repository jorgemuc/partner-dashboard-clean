param(
  [Parameter(Mandatory=$true)][string]$PortableExe
)
$ErrorActionPreference='Stop'
$tmp = 'dist\extract'
Remove-Item $tmp -Recurse -EA SilentlyContinue
New-Item $tmp -ItemType Directory | Out-Null

# 1) Liste aller Pfade im EXE lesen (per Node-Helper parsen)
$asarEntry = & 7z l -ba "$PortableExe" | node scripts/parse7zListing.js

if (-not $asarEntry) { Write-Error 'app.asar not found in EXE'; exit 1 }

# 2) Extrahieren (kann auch app-64.7z sein)
if ($asarEntry -like '*.asar') {
  & 7z e -aoa "$PortableExe" "$asarEntry" -o"$tmp" | Out-Null
}
elseif ($asarEntry -like '*.7z') {
  & 7z e -aoa "$PortableExe" "$asarEntry"          -o"$tmp" | Out-Null
  & 7z e -aoa "$tmp\$([IO.Path]::GetFileName($asarEntry))" 'resources/app.asar' -o"$tmp" | Out-Null
}
else { Write-Error "Unknown archive layout: $asarEntry"; exit 1 }

node scripts/verify-preload-in-asar.js (Join-Path $tmp 'app.asar')
exit $LASTEXITCODE
