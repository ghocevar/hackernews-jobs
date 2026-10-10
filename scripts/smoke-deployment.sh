#!/usr/bin/env bash
# Fail unless the deployed homepage returns 200 and contains every official job.
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

python3 - "$code" <<'PY'
import json
import sys
import urllib.request
from pathlib import Path

code = sys.argv[1]
html = Path("/tmp/hn-page.html").read_text(errors="replace")
base = "https://hacker-news.firebaseio.com"

def get_json(path: str):
    with urllib.request.urlopen(base + path, timeout=30) as response:
        return json.load(response)

ids = get_json("/v0/jobstories.json")
titles = []
for story_id in ids:
    item = get_json(f"/v0/item/{story_id}.json")
    if isinstance(item, dict) and item.get("type") == "job" and item.get("title"):
        titles.append(item["title"])

articles = html.count("<article")
missing = [title for title in titles if title not in html]
print(f"GET / -> {code}, firebase jobs {len(titles)}, articles {articles}")
if code != "200":
    sys.exit(f"GET / returned {code}")
if not titles:
    sys.exit("Firebase returned no job titles")
if missing:
    sys.exit(f"HTML is missing {len(missing)} job titles, including {missing[0]!r}")
if articles != len(titles):
    sys.exit(f"HTML has {articles} articles, Firebase has {len(titles)} jobs")
print("HTML includes every official job")
PY
