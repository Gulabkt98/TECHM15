"""Qdrant client management for clause vector search."""

from qdrant_client import QdrantClient

from app.config import get_settings

CLAUSE_COLLECTION = "lexguard_clauses"

_client: QdrantClient | None = None


def get_client() -> QdrantClient:
    global _client
    if _client is None:
        _client = QdrantClient(url=get_settings().qdrant_url)
    return _client
