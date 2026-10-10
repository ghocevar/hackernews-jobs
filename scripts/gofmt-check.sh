#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root"

unformatted="$(gofmt -l hn api cmd)"
if [[ -n "$unformatted" ]]; then
  echo "gofmt would change:"
  echo "$unformatted"
  exit 1
fi
