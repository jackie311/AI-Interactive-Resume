import os
import httpx
from fastapi import APIRouter
from functools import lru_cache
import time

router = APIRouter(prefix="/github", tags=["github"])

_cache: dict = {}
CACHE_TTL = 3600  # 1 hour


async def github_request(path: str) -> dict | list:
    token = os.getenv("GITHUB_TOKEN", "")
    headers = {"Accept": "application/vnd.github+json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    now = time.time()
    if path in _cache and now - _cache[path]["ts"] < CACHE_TTL:
        return _cache[path]["data"]

    async with httpx.AsyncClient() as client:
        r = await client.get(f"https://api.github.com{path}", headers=headers, timeout=10)
        r.raise_for_status()
        data = r.json()

    _cache[path] = {"data": data, "ts": now}
    return data


@router.get("/stats")
async def github_stats():
    username = os.getenv("GITHUB_USERNAME", "jackie311")
    repos = await github_request(f"/users/{username}/repos?per_page=100&sort=pushed")

    language_bytes: dict[str, int] = {}
    total_stars = 0
    total_forks = 0

    for repo in repos:
        if repo.get("fork"):
            continue
        total_stars += repo.get("stargazers_count", 0)
        total_forks += repo.get("forks_count", 0)
        lang = repo.get("language")
        if lang:
            language_bytes[lang] = language_bytes.get(lang, 0) + (repo.get("size", 0))

    # Sort languages by size
    sorted_langs = sorted(language_bytes.items(), key=lambda x: x[1], reverse=True)
    total = sum(v for _, v in sorted_langs) or 1
    languages = [{"name": k, "percentage": round(v / total * 100, 1)} for k, v in sorted_langs[:8]]

    return {
        "username": username,
        "public_repos": len([r for r in repos if not r.get("fork")]),
        "total_stars": total_stars,
        "total_forks": total_forks,
        "languages": languages,
    }


@router.get("/repo/{owner}/{repo}")
async def repo_stats(owner: str, repo: str):
    data = await github_request(f"/repos/{owner}/{repo}")
    return {
        "stars": data.get("stargazers_count", 0),
        "forks": data.get("forks_count", 0),
        "url": data.get("html_url"),
    }
