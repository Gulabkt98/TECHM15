"""Cross-document contradiction rules — deterministic numeric layer.

The LLM proposes contradiction candidates; this module CONFIRMS the
numeric ones (days, amounts, percentages) after unit normalisation, and
resolves winners via the Order of Precedence clause.
"""


def confirm_numeric_contradiction(claim: dict, clauses_by_id: dict) -> bool:
    # TODO(risk): parse both quoted values to canonical units and compare.
    raise NotImplementedError


def resolve_precedence(claim: dict, precedence_order: list[str]) -> str:
    # TODO(risk): return which document prevails for a confirmed conflict.
    raise NotImplementedError
