#!/usr/bin/env bash
set -euo pipefail

HOST=8.130.182.148
APP_DIR=/root/0719jili
COMMIT=$(git rev-parse --short HEAD)
ARCHIVE="/tmp/0719jili-${COMMIT}.tar.gz"
REMOTE_ARCHIVE="/root/0719jili-${COMMIT}.tar.gz"

git archive --format=tar.gz -o "$ARCHIVE" HEAD
scp -o BatchMode=yes "$ARCHIVE" "$HOST:$REMOTE_ARCHIVE"

ssh -o BatchMode=yes "$HOST" "set -e
stamp=\$(date +%Y%m%d%H%M%S)
release=/root/0719jili.release.\$stamp
mkdir -p \$release
tar -xzf $REMOTE_ARCHIVE -C \$release
if test -d $APP_DIR; then
  mv $APP_DIR /root/0719jili.backup.\$stamp
fi
mv \$release $APP_DIR
bash $APP_DIR/deploy/deploy-test.sh
"
