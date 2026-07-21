#!/usr/bin/env bash
set -euo pipefail

APP_DIR=/root/0719jili

cd "$APP_DIR"

# Phase 2: ensure .env exists for SQLite + session
if ! test -f .env; then
  cat > .env <<'ENV'
DATABASE_URL="file:./dev.db"
SESSION_SECRET="jili-demo-platform-secret-key-2026"
ENV
fi

npm ci
npx prisma db push --skip-generate
npx prisma generate
npx tsx prisma/seed.ts
npm test
npm run typecheck
NEXT_PUBLIC_BASE_PATH=/jili npm run build
mkdir -p .next/standalone/.next/static
cp -a .next/static/. .next/standalone/.next/static/
if test -d public; then
  mkdir -p .next/standalone/public
  cp -a public/. .next/standalone/public/
fi
# Phase 2: copy prisma files for standalone server
mkdir -p .next/standalone/prisma
cp -a prisma/schema.prisma .next/standalone/prisma/
cp -a prisma/dev.db .next/standalone/prisma/ 2>/dev/null || true
mkdir -p .next/standalone/node_modules/.prisma
cp -a node_modules/.prisma/client .next/standalone/node_modules/.prisma/ 2>/dev/null || true

pm2 startOrReload ecosystem.config.js --env production
pm2 save

WORD_CONF=/etc/nginx/conf.d/word.conf
if ! grep -q "location \^~ /jili/" "$WORD_CONF"; then
  cp -a "$WORD_CONF" "$WORD_CONF.bak.$(date +%Y%m%d%H%M%S)"
  awk '
    !done && /^    location \/ \{/ {
      print "    location = /jili {"
      print "        return 301 /jili/;"
      print "    }"
      print ""
      print "    location ^~ /jili/ {"
      print "        proxy_pass http://127.0.0.1:3006;"
      print "        proxy_http_version 1.1;"
      print "        proxy_set_header Host $host;"
      print "        proxy_set_header X-Real-IP $remote_addr;"
      print "        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;"
      print "        proxy_set_header X-Forwarded-Proto $scheme;"
      print "        proxy_set_header Upgrade $http_upgrade;"
      print "        proxy_set_header Connection \"upgrade\";"
      print "        proxy_read_timeout 120s;"
      print "    }"
      print ""
      done=1
    }
    { print }
  ' "$WORD_CONF" > "$WORD_CONF.tmp"
  mv "$WORD_CONF.tmp" "$WORD_CONF"
fi

if ! grep -q "# jili-http-bypass" "$WORD_CONF"; then
  cp -a "$WORD_CONF" "$WORD_CONF.bak.$(date +%Y%m%d%H%M%S)"
  sed -i '/^[[:space:]]*if (\$host = word\.linklike\.com\.cn) {/,/} # managed by Certbot$/d' "$WORD_CONF"
  awk '
    /return 404; # managed by Certbot/ {
      print "    # jili-http-bypass"
      print "    location = /jili {"
      print "        return 301 /jili/;"
      print "    }"
      print ""
      print "    location ^~ /jili/ {"
      print "        proxy_pass http://127.0.0.1:3006;"
      print "        proxy_http_version 1.1;"
      print "        proxy_set_header Host $host;"
      print "        proxy_set_header X-Real-IP $remote_addr;"
      print "        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;"
      print "        proxy_set_header X-Forwarded-Proto $scheme;"
      print "        proxy_set_header Upgrade $http_upgrade;"
      print "        proxy_set_header Connection \"upgrade\";"
      print "        proxy_read_timeout 120s;"
      print "    }"
      print ""
      print "    location / {"
      print "        return 301 https://$host$request_uri;"
      print "    }"
      next
    }
    { print }
  ' "$WORD_CONF" > "$WORD_CONF.tmp"
  mv "$WORD_CONF.tmp" "$WORD_CONF"
fi

if test -f /etc/nginx/conf.d/jili-demo.conf; then
  mv /etc/nginx/conf.d/jili-demo.conf "/etc/nginx/conf.d/jili-demo.conf.disabled.$(date +%Y%m%d%H%M%S)"
fi
nginx -t
systemctl reload nginx

node - <<'NODE'
// Phase 2: smoke test with auth — login first, then check dashboard
const base = "http://127.0.0.1:3006/jili";

async function waitForServer() {
  for (let attempt = 1; attempt <= 20; attempt += 1) {
    try {
      const res = await fetch(`${base}/login`);
      if (res.ok) { console.log(`server ready on attempt ${attempt}`); return; }
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  console.error("local smoke failed: server not ready");
  process.exit(1);
}

async function loginAndCheck() {
  const loginRes = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "wangxin", password: "demo123" }),
    redirect: "manual",
  });
  if (!loginRes.ok) { console.error("login failed"); process.exit(1); }
  const cookie = loginRes.headers.get("set-cookie")?.split(";")[0] ?? "";

  const dashRes = await fetch(`${base}/api/state`, { headers: { Cookie: cookie } });
  if (!dashRes.ok) { console.error("state API failed after login"); process.exit(1); }
  const state = await dashRes.json();
  if (!state.projects?.length) { console.error("state has no projects"); process.exit(1); }
  console.log("local smoke passed: login + state API OK");
}

await waitForServer();
await loginAndCheck();
NODE
echo "jili-demo deployed: http://word.linklike.com.cn/jili/login"
