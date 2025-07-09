#!/usr/bin/env bash
set -euo pipefail
app_exe=$(ls dist/*.exe | head -n1)
[ -f "$app_exe" ] || { echo "❌ $app_exe missing"; exit 1; }
npx asar list "$app_exe" | grep -q "${PRELOAD_PATH_DIST:-dist/preload.js}"
echo "✅ preload present in asar"
