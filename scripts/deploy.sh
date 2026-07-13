#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

PORT="${PORT:-3007}"
HEALTH_URL="${HEALTH_URL:-http://127.0.0.1:${PORT}/}"
STAGING_DIR=".next-staging"
BACKUP_DIR=".next-prev"
LOCK_HASH_FILE="node_modules/.package-lock.sha"
SWAPPED=false

if ! command -v pm2 >/dev/null 2>&1; then
  echo "PM2 is not installed. Run: npm i -g pm2"
  exit 1
fi

hash_file() {
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum "$1" | awk '{print $1}'
  else
    shasum -a 256 "$1" | awk '{print $1}'
  fi
}

rollback() {
  if [ "$SWAPPED" != true ] || [ ! -d "$BACKUP_DIR" ]; then
    return
  fi
  echo "==> Rolling back to previous build..."
  rm -rf .next 2>/dev/null || true
  mv "$BACKUP_DIR" .next
  if pm2 describe spiritbullclub >/dev/null 2>&1; then
    pm2 reload ecosystem.config.cjs --update-env || true
  fi
}

on_error() {
  echo "==> Deploy failed."
  rollback
  exit 1
}

trap on_error ERR

install_deps() {
  local hash
  hash="$(hash_file package-lock.json)"
  if [ -d node_modules ] && [ -f "$LOCK_HASH_FILE" ] && [ "$(cat "$LOCK_HASH_FILE")" = "$hash" ]; then
    echo "==> Dependencies unchanged — skipping npm ci"
    return
  fi
  echo "==> Installing dependencies..."
  npm ci
  echo "$hash" > "$LOCK_HASH_FILE"
}

health_check() {
  local tries="${HEALTH_CHECK_TRIES:-20}"
  local delay="${HEALTH_CHECK_DELAY:-2}"
  local i code

  echo "==> Waiting for app health at ${HEALTH_URL}"
  for ((i = 1; i <= tries; i++)); do
    code="$(curl -fsS -o /dev/null -w "%{http_code}" "$HEALTH_URL" 2>/dev/null || echo "000")"
    if [[ "$code" =~ ^(200|301|302|304)$ ]]; then
      echo "==> Health check passed (HTTP ${code})"
      return 0
    fi
    sleep "$delay"
  done
  echo "==> Health check failed after ${tries} attempts (last HTTP ${code})"
  return 1
}

echo "==> Spirit Bull Club safe deploy (PM2 · port ${PORT})"
mkdir -p logs

install_deps

echo "==> Building production bundle (staging — live site keeps running)..."
rm -rf "$STAGING_DIR"
NEXT_DIST_DIR="$STAGING_DIR" npm run build

echo "==> Swapping build into place..."
rm -rf "$BACKUP_DIR"
if [ -d .next ]; then
  mv .next "$BACKUP_DIR"
fi
mv "$STAGING_DIR" .next
SWAPPED=true

if pm2 describe spiritbullclub >/dev/null 2>&1; then
  echo "==> Reloading PM2 app..."
  pm2 reload ecosystem.config.cjs --update-env
else
  echo "==> Starting PM2 app..."
  pm2 start ecosystem.config.cjs
fi

health_check

trap - ERR
SWAPPED=false
rm -rf "$BACKUP_DIR"

pm2 save >/dev/null 2>&1 || true

echo "==> Deployed safely · http://0.0.0.0:${PORT}"
echo "    pm2 status"
echo "    pm2 logs spiritbullclub"
