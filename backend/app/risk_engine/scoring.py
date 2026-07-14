"""Severity scoring — deterministic, playbook-driven.

Severity comes from the kind of rule breach (walk-away → critical,
limit breach → high, gap/soft breach → medium), never from LLM vibes.
Extraction confidence is carried separately and never blended in.
"""

from app.constants import Severity

_TIER_MAP = {
    "walk_away": Severity.CRITICAL,
    "cross_document_conflict": Severity.HIGH,
    "limit_breach": Severity.HIGH,
    "table_prose_conflict": Severity.CRITICAL,
    "soft_breach": Severity.MEDIUM,
    "missing_protection": Severity.MEDIUM,
    "info": Severity.LOW,
}


def score(breach_kind: str) -> Severity:
    return _TIER_MAP.get(breach_kind, Severity.MEDIUM)
