#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from datetime import datetime
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
POSTS_DIR = ROOT / "Content" / "posts"
OUTPUT_PATH = POSTS_DIR / "index.json"


def parse_frontmatter(markdown_text: str) -> dict[str, Any]:
    match = re.match(r"^---\r?\n(.*?)\r?\n---\r?\n?", markdown_text, re.DOTALL)
    if not match:
        return {}

    lines = match.group(1).splitlines()
    metadata: dict[str, Any] = {}
    current_list_key: str | None = None

    for raw_line in lines:
        line = raw_line.rstrip()
        if not line:
            continue

        list_item_match = re.match(r"^\s*-\s*(.+)$", line)
        if list_item_match and current_list_key:
            metadata.setdefault(current_list_key, []).append(list_item_match.group(1).strip())
            continue

        key_value_match = re.match(r"^([A-Za-z0-9_-]+):\s*(.*)$", line)
        if not key_value_match:
            current_list_key = None
            continue

        key = key_value_match.group(1).strip()
        value = key_value_match.group(2).strip()

        if value == "":
            metadata[key] = []
            current_list_key = key
        else:
            metadata[key] = value
            current_list_key = None

    return metadata


def as_sort_key(date_value: Any) -> float:
    if not isinstance(date_value, str) or not date_value:
        return 0.0
    try:
        # Handles ISO-like strings such as 2024-11-27T18:30:00
        return datetime.fromisoformat(date_value).timestamp()
    except ValueError:
        return 0.0


def build_post_record(slug: str, metadata: dict[str, Any]) -> dict[str, Any]:
    record: dict[str, Any] = {
        "slug": slug,
        "title": metadata.get("title") or slug,
        "desc": metadata.get("desc") or "No description available.",
    }

    for key in ("date", "updated", "image"):
        value = metadata.get(key)
        if isinstance(value, str) and value.strip():
            record[key] = value.strip()

    tags = metadata.get("tags")
    if isinstance(tags, list):
        record["tags"] = [str(tag).strip() for tag in tags if str(tag).strip()]
    else:
        record["tags"] = []

    return record


def collect_posts() -> list[dict[str, Any]]:
    posts: list[dict[str, Any]] = []
    if not POSTS_DIR.exists():
        return posts

    for post_md in POSTS_DIR.glob("*/post.md"):
        slug = post_md.parent.name
        metadata = parse_frontmatter(post_md.read_text(encoding="utf-8"))
        posts.append(build_post_record(slug, metadata))

    posts.sort(key=lambda p: as_sort_key(p.get("date")), reverse=True)
    return posts


def main() -> None:
    posts = collect_posts()
    OUTPUT_PATH.write_text(json.dumps(posts, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(posts)} posts to {OUTPUT_PATH.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
