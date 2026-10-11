#!/usr/bin/env python3
import html
import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request


def gh_json(path: str):
    raw = subprocess.check_output(["gh", "api", path], text=True)
    return json.loads(raw)


def deployment_url() -> str:
    repo = os.environ["GITHUB_REPOSITORY"]
    sha = os.environ.get("SMOKE_SHA") or os.environ["GITHUB_SHA"]
    for _ in range(48):
        deployments = gh_json(f"repos/{repo}/deployments?sha={sha}&per_page=20")
        chosen = None
        for environment in ("Production", "Preview"):
            for deployment in deployments:
                if deployment.get("environment") == environment:
                    chosen = deployment
                    break
            if chosen is not None:
                break
        if chosen is None:
            time.sleep(5)
            continue
        statuses = gh_json(f"repos/{repo}/deployments/{chosen['id']}/statuses")
        status = statuses[0] if statuses else {}
        state = status.get("state") or ""
        env_url = status.get("environment_url") or ""
        if state == "success" and env_url:
            return env_url
        if state in ("failure", "error"):
            description = status.get("description") or state
            raise SystemExit(f"Vercel deployment {state}: {description}")
        time.sleep(5)
    raise SystemExit("No successful Vercel deployment URL for this commit.")


def check_page(url: str) -> None:
    page = f"{url.rstrip('/')}/"
    request = urllib.request.Request(page, method="GET")
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            code = response.status
            body = response.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as error:
        code = error.code
        body = error.read().decode("utf-8", "replace")

    text = html.unescape(body)
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

    articles = text.count("<article")
    missing = [title for title in titles if title not in text]
    print(f"GET / -> {code}, firebase jobs {len(titles)}, articles {articles}")
    if code != 200:
        raise SystemExit(f"GET / returned {code}")
    if not titles:
        raise SystemExit("Firebase returned no job titles")
    if missing:
        raise SystemExit(
            f"HTML is missing {len(missing)} job titles, including {missing[0]!r}"
        )
    if articles != len(titles):
        raise SystemExit(
            f"HTML has {articles} articles, Firebase has {len(titles)} jobs"
        )
    print("HTML includes every official job")


def main() -> None:
    url = sys.argv[1] if len(sys.argv) > 1 else ""
    if not url:
        url = deployment_url()
    print(f"Smoking {url.rstrip('/')}/", flush=True)
    check_page(url)


if __name__ == "__main__":
    main()
