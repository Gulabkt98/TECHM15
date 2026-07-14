"""Document-level metadata: title and parties, from first-page heuristics."""

import re

_PARTIES = re.compile(
    r"between\s+(.{3,80}?)\s*\((?:the\s+)?[\"“].{2,30}[\"”]\)\s*,?\s*and\s+(.{3,80}?)\s*\(",
    re.IGNORECASE | re.DOTALL,
)


def extract_metadata(pages: list[dict]) -> dict:
    first = pages[0]["text"] if pages else ""
    lines = [line.strip() for line in first.splitlines() if line.strip()]
    title = lines[0][:200] if lines else "Untitled document"

    parties: list[str] = []
    match = _PARTIES.search(first)
    if match:
        parties = [match.group(1).strip(), match.group(2).strip()]

    return {"title": title, "parties": parties}
