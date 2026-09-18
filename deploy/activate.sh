#!/usr/bin/env bash
# Frontend'i yayina alir. Kullanim: bash activate.sh 20260917-203000
set -euo pipefail

BASE=/var/www/mazen/frontend
REL="${1:?surum klasoru adi gerekli}"

ln -sfnT "$BASE/releases/$REL" "$BASE/current"
sudo /usr/bin/systemctl restart mazen-frontend

for i in 1 2 3 4 5 6; do
  if curl -fsS http://127.0.0.1:3000/ > /dev/null; then
    echo "Saglik kontrolu OK"
    ls -1dt "$BASE"/releases/*/ | tail -n +6 | xargs -r rm -rf
    exit 0
  fi
  sleep 3
done

echo "FRONTEND AYAGA KALKMADI" >&2
exit 1
