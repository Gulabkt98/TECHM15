"""Deterministic normalisation of legal quantities.

Turns "within thirty (30) days", "Net 60", "twelve (12) months" into
canonical numbers so comparisons are code, not LLM vibes. Every parse
returns the exact source phrase for citation.
"""

import re

_WORDS = {
    "one": 1, "two": 2, "three": 3, "five": 5, "seven": 7, "ten": 10,
    "fourteen": 14, "fifteen": 15, "twenty": 20, "thirty": 30, "forty": 40,
    "forty-five": 45, "sixty": 60, "ninety": 90, "twelve": 12, "eighteen": 18,
    "twenty-four": 24, "thirty-six": 36,
}

_NUM_UNIT = re.compile(
    r"(?:(?P<word>[a-z-]+)\s*)?\(?(?P<num>\d{1,4})\)?\s*(?P<unit>days?|months?|years?)\b",
    re.IGNORECASE,
)
_NET = re.compile(r"\bNet\s*(\d{1,3})\b", re.IGNORECASE)
_PERCENT = re.compile(r"(\d{1,3}(?:\.\d+)?)\s*%")


def parse_durations(text: str, unit: str) -> list[tuple[int, str]]:
    """All (value, source_phrase) for the given unit: 'day'|'month'|'year'."""
    found = []
    for match in _NUM_UNIT.finditer(text):
        if match.group("unit").lower().rstrip("s") == unit:
            found.append((int(match.group("num")), match.group(0)))
    if unit == "day":
        for match in _NET.finditer(text):
            found.append((int(match.group(1)), match.group(0)))
    return found


def parse_percents(text: str) -> list[tuple[float, str]]:
    return [(float(m.group(1)), m.group(0)) for m in _PERCENT.finditer(text)]


def sentence_containing(text: str, phrase: str) -> str:
    """The full sentence around the first occurrence of phrase — used as
    the verbatim citation quote."""
    idx = text.find(phrase)
    if idx == -1:
        return phrase
    start = max(text.rfind(".", 0, idx), text.rfind("\n", 0, idx)) + 1
    end_dot = text.find(".", idx + len(phrase))
    end = end_dot + 1 if end_dot != -1 else min(len(text), idx + len(phrase) + 120)
    return text[start:end].strip()
