"""Cross-encoder re-ranking of fused retrieval candidates."""


def rerank(query: str, candidates: list[dict], top_k: int = 5) -> list[dict]:
    # TODO(rag): cross-encoder scoring; keep candidate payloads intact.
    raise NotImplementedError
