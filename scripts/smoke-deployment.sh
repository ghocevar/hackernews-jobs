#!/usr/bin/env bash
# Fail unless the deployed site's / returns 200 and includes a live job title.
set -euo pipefail

url="${1:-}"
if [[ -z "$url" ]]; then
  repo="${GITHUB_REPOSITORY:?}"
  sha="${GITHUB_SHA:?}"
  url=""
  for _ in $(seq 1 48); do
    id="$(gh api "repos/${repo}/deployments?sha=${sha}&per_page=20" --jq '[.[] | select(.environment == "Production" or .environment == "Preview")] | sort_by(if .environment == "Production" then 0 else 1 end) | .[0].id // empty')"
    if [[ -n "$id" ]]; then
      url="$(gh api "repos/${repo}/deployments/${id}/statuses" --jq '[.[] | select(.state == "success" and (.environment_url // "") != "")] | .[0].environment_url // empty')"
    fi
    if [[ -n "$url" ]]; then
      break
    fi
    sleep 5
  done
fi

if [[ -z "$url" ]]; then
  echo "No successful Vercel deployment URL for this commit." >&2
  exit 1
fi

url="${url%/}"
echo "Smoking ${url}/"

code="$(curl -fsS -o /tmp/hn-page.html -w '%{http_code}' --max-time 30 "${url}/")"
curl -fsS -o /tmp/hn-stories.json --max-time 30 "${url}/api/stories" >/dev/null

python3 - "$code" <<'PY'
import json
import sys
from pathlib import Path

code = sys.argv[1]
html = Path("/tmp/hn-page.html").read_text(errors="replace")
stories = json.loads(Path("/tmp/hn-stories.json").read_text())
titles = [story["title"] for story in stories if story.get("title")]
print(f"GET / -> {code}, titles {len(titles)}, html bytes {len(html)}")
if code != "200":
    sys.exit(f"GET / returned {code}")
if not titles:
    sys.exit("API returned no job titles")
found = next((title for title in titles if title in html), None)
if not found:
    sys.exit(f"HTML did not include a live job title such as {titles[0]!r}")
print(f"HTML includes {found!r}")
PY
