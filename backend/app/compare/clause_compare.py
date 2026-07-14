"""Pairwise clause comparison primitives.

Numeric comparison is deterministic (normalised units); the verdict
never comes from an LLM alone.
"""

from app.risk_engine.normalize import parse_durations


def compare_clauses(clause_a: dict, clause_b: dict) -> dict:
    """Return {verdict: consistent|contradiction|undecidable, detail}."""
    if clause_a["clause_type"] != clause_b["clause_type"]:
        return {"verdict": "undecidable", "detail": "Different clause types — not comparable."}

    for unit in ("day", "month", "year"):
        values_a = parse_durations(clause_a["text"], unit)
        values_b = parse_durations(clause_b["text"], unit)
        if values_a and values_b:
            if values_a[0][0] != values_b[0][0]:
                return {
                    "verdict": "contradiction",
                    "detail": (
                        f"{clause_a['clause_ref']} specifies {values_a[0][0]} {unit}(s) "
                        f"({values_a[0][1]!r}) but {clause_b['clause_ref']} specifies "
                        f"{values_b[0][0]} {unit}(s) ({values_b[0][1]!r})."
                    ),
                    "quotes": [values_a[0][1], values_b[0][1]],
                }
            return {"verdict": "consistent", "detail": f"Both specify {values_a[0][0]} {unit}(s)."}

    return {"verdict": "undecidable", "detail": "No comparable normalised values found."}
