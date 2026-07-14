"""Severity scoring — deterministic, playbook-driven.

Severity comes from the playbook rule that fired (walk-away → critical,
fallback → high/medium), never from LLM vibes. Extraction confidence is
carried separately and never blended into severity.
"""

from app.constants import Severity


def score(claim: dict, playbook_rule: dict) -> Severity:
    # TODO(risk): map rule tier + exposure magnitude to Severity.
    raise NotImplementedError
