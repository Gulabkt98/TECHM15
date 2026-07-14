"""Re-ranking of retrieval candidates.

Default: lexical overlap re-scoring (deterministic). A cross-encoder can
replace _score without changing the interface.
"""

from app.compare.similarity import jaccard


def rerank(query: str, candidates: list[dict], top_k: int = 5) -> list[dict]:
    return sorted(candidates, key=lambda c: jaccard(query, c["text"]), reverse=True)[:top_k]
