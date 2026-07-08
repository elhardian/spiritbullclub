#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

PORT="${PORT:-3007}"

if ! command -v pm2 >/dev/null 2>&1; then
  echo "PM2 is not installed. Run: npm i -g pm2"
  exit 1
fi

echo "==> Spirit Bull Club deploy (PM2 · port ${PORT})"

mkdir -p logs

if [[ ! -d node_modules ]]; then
  echo "==> Installing dependencies..."
  npm ci
fi

echo "==> Building production bundle..."
npm run build

if pm2 describe spiritbullclub >/dev/null 2>&1; then
  echo "==> Reloading PM2 app..."
  pm2 reload ecosystem.config.cjs --update-env
else
  echo "==> Starting PM2 app..."
  pm2 start ecosystem.config.cjs
fi

pm2 save >/dev/null 2>&1 || true

echo "==> Deployed · http://0.0.0.0:${PORT}"
echo "    pm2 status"
echo "    pm2 logs spiritbullclub"
