"""Playbook loading — the configurable legal rulebook.

Playbooks are versioned JSON files in app/playbooks/. Swapping the file
(or pointing at a client-specific one) changes what gets flagged without
touching code.
"""

import json
from functools import lru_cache
from pathlib import Path

PLAYBOOK_DIR = Path(__file__).resolve().parent.parent / "playbooks"


@lru_cache
def load_playbook(name: str = "default") -> dict:
    path = PLAYBOOK_DIR / f"{name}.json"
    with open(path, encoding="utf-8") as handle:
        return json.load(handle)


def list_playbooks() -> list[str]:
    return sorted(p.stem for p in PLAYBOOK_DIR.glob("*.json"))
