#!/usr/bin/env bash
set -euo pipefail

APP_DIR=/root/0719jili

cd "$APP_DIR"

npm ci
npm test
npm run typecheck
NEXT_PUBLIC_BASE_PATH=/jili npm run build

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
const url = "http://127.0.0.1:3006/jili/dashboard";
for (let attempt = 1; attempt <= 20; attempt += 1) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    if (response.ok && html.includes("改制业务驾驶舱")) {
      console.log(`local smoke passed on attempt ${attempt}`);
      process.exit(0);
    }
  } catch {}
  await new Promise((resolve) => setTimeout(resolve, 500));
}
console.error("local smoke failed: dashboard was not ready");
process.exit(1);
NODE
echo "jili-demo deployed: http://word.linklike.com.cn/jili/dashboard"
