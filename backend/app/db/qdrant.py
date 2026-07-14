"""Qdrant client management (optional feature — lazy import)."""

from app.config import get_settings

CLAUSE_COLLECTION = "lexguard_clauses"

_client = None


def get_client():
    global _client
    if _client is None:
        from qdrant_client import QdrantClient  # imported only when the feature is on

        _client = QdrantClient(url=get_settings().qdrant_url)
    return _client
