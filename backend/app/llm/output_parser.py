"""Strict validation of LLM outputs before any agent consumes them.

A claim missing its verbatim quote or clause_ref is malformed and is
dropped here — the grounding gate then verifies the quotes that remain.
"""

REQUIRED_CLAIM_FIELDS = {"summary", "quote", "clause_ref"}


def parse_claims(raw: dict) -> tuple[list[dict], list[dict]]:
    """Split raw LLM output into (well_formed_claims, malformed_dropped)."""
    claims = raw.get("claims", []) if isinstance(raw, dict) else []
    well_formed = [c for c in claims if REQUIRED_CLAIM_FIELDS.issubset(c)]
    malformed = [c for c in claims if not REQUIRED_CLAIM_FIELDS.issubset(c)]
    return well_formed, malformed
