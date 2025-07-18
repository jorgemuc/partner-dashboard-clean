#!/usr/bin/env bash
set -euo pipefail

echo "[dev-verify] npm ci"
npm ci

echo "[dev-verify] lint"
npm run lint

echo "[dev-verify] backlog columns"
node scripts/check-backlog.js

echo "[dev-verify] jest unit"
npm test

echo "[dev-verify] bundle"
npm run bundle

echo "[dev-verify] smoke (xvfb-run)"
if command -v xvfb-run >/dev/null 2>&1; then
  DISPLAY=:99 xvfb-run -a npm run smoke
else
  echo "[dev-verify] xvfb-run not found; skipping smoke" >&2
fi

echo "[dev-verify] OK"
