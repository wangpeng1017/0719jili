#!/usr/bin/env bash
set -euo pipefail

APP_DIR=/root/0719jili

cd "$APP_DIR"

npm ci
npm test
npm run typecheck
npm run build

pm2 startOrReload ecosystem.config.js --env production
pm2 save

install -m 0644 deploy/nginx-jili-demo.conf /etc/nginx/conf.d/jili-demo.conf
nginx -t
systemctl reload nginx

curl --fail --silent http://127.0.0.1:3006/dashboard >/dev/null
echo "jili-demo deployed: http://jili.8.130.182.148.nip.io"
