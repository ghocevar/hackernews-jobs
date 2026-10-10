#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root"

if ! command -v go >/dev/null 2>&1; then
  echo "Go 1.27 or newer is required on PATH." >&2
  exit 1
fi

go run -C api . &
api_pid=$!

cleanup() {
  if kill -0 "$api_pid" 2>/dev/null; then
    kill "$api_pid" 2>/dev/null || true
    wait "$api_pid" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

ready=0
for _ in $(seq 1 300); do
  if (echo >/dev/tcp/127.0.0.1/8080) >/dev/null 2>&1; then
    ready=1
    break
  fi
  if ! kill -0 "$api_pid" 2>/dev/null; then
    echo "The jobs API exited before it started listening on :8080." >&2
    wait "$api_pid" || true
    exit 1
  fi
  sleep 0.1
done

if [[ "$ready" -ne 1 ]]; then
  echo "Timed out waiting for the jobs API on :8080." >&2
  exit 1
fi

exec pnpm exec next dev
