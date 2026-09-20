#!/usr/bin/env bash
set -euo pipefail

BASE=/var/www/mazen/frontend
REL="${1:?release required}"
[[ "$REL" =~ ^[0-9]{8}-[0-9]{6}(-[a-z0-9]+)?$ ]] || exit 2
DIR="$(realpath "$BASE/releases/$REL")"
[[ "$DIR" == "$BASE/releases/$REL" ]] || exit 2
PREVIOUS="$(readlink -f "$BASE/current" || true)"

rollback() {
  if [[ -d "$PREVIOUS" && "$PREVIOUS" == "$BASE/releases/"* ]]; then
    ln -sfnT "$PREVIOUS" "$BASE/current"
    sudo /usr/bin/systemctl restart mazen-frontend
    echo "Frontend release rolled back." >&2
  fi
}
trap rollback ERR

ln -sfnT "$DIR" "$BASE/current"
sudo /usr/bin/systemctl restart mazen-frontend
for i in 1 2 3 4 5; do
  if curl -fsS -H "Host: mazenkirtasiye.com" http://127.0.0.1:3000/ >/dev/null \
    && curl -fsS -H "Host: mazenkirtasiye.com" http://127.0.0.1:3000/urunler >/dev/null; then
    echo "Frontend health checks passed. Previous releases retained."
    exit 0
  fi
  sleep 3
done
false
