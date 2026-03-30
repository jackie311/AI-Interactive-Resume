"""
Simple persistent chat statistics stored as JSON on EFS (chroma_db/).
Thread-safe via a lock; file writes are best-effort (failures silently ignored).
"""

import json
import threading
from pathlib import Path

STATS_FILE = Path(__file__).parent / "chroma_db" / "stats.json"

_lock = threading.Lock()
_stats: dict = {"total_questions": 0, "total_conversations": 0}


def _load() -> None:
    global _stats
    if STATS_FILE.exists():
        try:
            _stats = json.loads(STATS_FILE.read_text())
        except Exception:
            pass


def _save() -> None:
    try:
        STATS_FILE.parent.mkdir(parents=True, exist_ok=True)
        STATS_FILE.write_text(json.dumps(_stats))
    except Exception:
        pass


_load()


def record(is_new_conversation: bool) -> None:
    with _lock:
        _stats["total_questions"] += 1
        if is_new_conversation:
            _stats["total_conversations"] += 1
        _save()


def get() -> dict:
    with _lock:
        return dict(_stats)
