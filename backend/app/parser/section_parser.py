"""Section recovery from raw page text.

Deterministic: a line starting with decimal numbering ("9.", "9.2", "9.2.1")
opens a new section. Text before the first numbered line (title page,
recitals) is kept as an unnumbered preamble with lower confidence —
flagged honestly, never guessed.
"""

import re

_NUMBERED = re.compile(r"^(\d+(?:\.\d+)*)[\.\)]?\s+(.{0,120})")


def build_section_tree(pages: list[dict]) -> list[dict]:
    """Return ordered sections: {ref, title, page, char_start, char_end, confidence}."""
    sections: list[dict] = []
    for page in pages:
        offset = page["char_start"]
        for line in page["text"].splitlines(keepends=True):
            stripped = line.strip()
            match = _NUMBERED.match(stripped)
            if match and _plausible_ref(match.group(1)):
                sections.append(
                    {
                        "ref": match.group(1),
                        "title": match.group(2).strip().rstrip("."),
                        "page": page["number"],
                        "char_start": offset,
                        "char_end": offset,  # fixed up below
                        "confidence": 0.95,
                    }
                )
            offset += len(line)

    total_end = pages[-1]["char_end"] if pages else 0
    for i, section in enumerate(sections):
        section["char_end"] = sections[i + 1]["char_start"] if i + 1 < len(sections) else total_end

    if not sections and pages:
        # No numbering recognised — one low-confidence section for review routing.
        sections.append(
            {
                "ref": "0", "title": "Unstructured document", "page": 1,
                "char_start": 0, "char_end": total_end, "confidence": 0.5,
            }
        )
    return sections


def _plausible_ref(ref: str) -> bool:
    """Filter out years/amounts masquerading as section numbers."""
    head = ref.split(".")[0]
    return len(head) <= 2 and all(len(p) <= 2 for p in ref.split("."))
