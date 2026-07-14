"""MSA vs SOW alignment — thin façade over the contradiction engine.

Pairs comparable clauses across the family and returns confirmed
cross-document contradictions with citations for both sides.
"""

from app.risk_engine.contradictions import find_cross_document_contradictions


def align_and_compare(clauses: list[dict], documents_by_id: dict[str, dict]) -> list[dict]:
    return find_cross_document_contradictions(clauses, documents_by_id)
