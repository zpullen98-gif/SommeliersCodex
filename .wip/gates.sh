#!/usr/bin/env bash
# gates.sh: every Codex gate in one run, one line each, against this checkout (work in progress, removed at publish).
#   bash .wip/gates.sh            every gate
#   bash .wip/gates.sh grapes card   only the gates whose name holds one of the words
#   GATE_ARGS_check_grapes="--partial" passes arguments to one gate (dots and dashes in the name become underscores)
# A gate that needs a browser gets PLAYWRIGHT_MODULE and a local server on CODEX_URL (.wip/serve.mjs, port 8791
# or PORT). Exit 1 when any gate fails. The baseline at master 7d14d1c: every gate rc 0 (.wip/gates-baseline.txt).
set -u
C="$(cd "$(dirname "$0")/.." && pwd)"
SITE="${SITE_ROOT:-/home/user/zpullen98-gif.github.io}"
WT="${WORLDTABLE:-/home/user/worldtable}"
SP="/tmp/claude-0/-home-user-zpullen98-gif-github-io/09201eae-82ec-5cba-9316-4d6cf5955e5e/scratchpad"
[ -e /home/user/WorldTable ] || ln -sfn "$WT" /home/user/WorldTable
export PLAYWRIGHT_MODULE="${PLAYWRIGHT_MODULE:-$WT/node_modules/playwright}"
# WorldTable's Playwright asks for browser build 1234; $SP/pw links that name to the build this machine holds (1243).
if [ ! -d "$SP/pw" ]; then mkdir -p "$SP/pw"; for e in /opt/pw-browsers/*; do ln -sfn "$e" "$SP/pw/$(basename "$e")"; done; ln -sfn /opt/pw-browsers/chromium-1243 "$SP/pw/chromium-1234"; ln -sfn /opt/pw-browsers/chromium_headless_shell-1243 "$SP/pw/chromium_headless_shell-1234"; fi
export PLAYWRIGHT_BROWSERS_PATH="$SP/pw"
export OOT_SHARED="${OOT_SHARED:-$SITE/shared}"
export OOT_HOUSE_PACK="${OOT_HOUSE_PACK:-$WT/static/shared/packs/brennans-new-orleans.v1.oothouse.json}"
PORT="${PORT:-8791}"
cd "$C" || exit 1
SITE_ROOT="$SITE" CODEX_SRC="$C" node .wip/serve.mjs "$PORT" >/dev/null 2>&1 &
SERVE=$!
trap 'kill $SERVE 2>/dev/null' EXIT
sleep 1
export CODEX_URL="http://127.0.0.1:$PORT/codex/"
fail=0; n=0
for f in .scripts/check-*.js .scripts/check-*.cjs; do
  b="$(basename "$f")"
  if [ $# -gt 0 ]; then hit=0; for w in "$@"; do case "$b" in *"$w"*) hit=1;; esac; done; [ $hit = 1 ] || continue; fi
  key="GATE_ARGS_$(echo "${b%.*}" | tr '.-' '__')"
  extra="${!key:-}"
  case "$b" in
    check-learning-flow.cjs) args="$PLAYWRIGHT_MODULE";;
    check-study-rounds.cjs) args=". $PLAYWRIGHT_MODULE";;
    *) args="";;
  esac
  t0=$(date +%s)
  out="$(timeout "${GATE_TIMEOUT:-420}" node "$f" $args $extra 2>&1)"; rc=$?
  t1=$(date +%s)
  n=$((n+1))
  if [ $rc != 0 ]; then fail=$((fail+1)); fi
  printf '%s [rc %s, %ss] :: %s\n' "$b" "$rc" "$((t1-t0))" "$(printf '%s' "$out" | tail -1 | cut -c1-160)"
  if [ $rc != 0 ]; then mkdir -p "$SP/gate-logs"; printf '%s\n' "$out" > "$SP/gate-logs/$b.log"; printf '%s\n' "$out" | grep -i -m6 'fail\|error' | cut -c1-240 | sed 's/^/      /'; echo "      full output: $SP/gate-logs/$b.log"; fi
done
echo "gates: $n run, $fail failed"
[ $fail = 0 ]
