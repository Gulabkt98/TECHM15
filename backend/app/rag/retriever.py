"""Hybrid retrieval: dense (Qdrant) + sparse (BM25), graph-scoped.

Scope filter: only chunks from the contract family and, when analysing a
specific clause, its dependency neighborhood + comparable sibling clauses.
"""


def retrieve(
    query: str,
    family_id: str,
    scope_clause_ids: list[str] | None = None,
    k: int = 8,
) -> list[dict]:
    # TODO(rag): dense + BM25 fusion (reciprocal rank), payload filtering.
    raise NotImplementedError
